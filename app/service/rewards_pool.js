"use strict";

const Service = require("egg").Service;

class Rewards_poolService extends Service {
  async saveNew(params = {}) {
    const { app } = this;
    const result = await app.model.RewardsPool.saveNew(params);
    return result;
  }

  async getOrCreateRewardsPool(params = {}) {
    const { app, ctx } = this;
    const { user_id } = params;
    let wallet = await app.model.RewardsPool.findOne({
      where: { user_id },
    });

    if (!wallet) {
      const user = await ctx.service.user.getUserByUuid(user_id);
      wallet = await this.saveNew({
        user_id,
        balance: user.balance || 0,
        total_in: user.balance || 0,
      });
    }
    return wallet;
  }

  async updateBalance(params = {}) {
    const { app } = this;
    const { userId, amount, txnType, orderId, remark, description } = params;

    return await app.transaction(async transaction => {
      // 1. 更新钱包余额
      const wallet = await app.model.RewardsPool.findOne({
        where: { user_id: userId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet) {
        this.logger.info("wallet not found, auto create a new wallet");
        this.getOrCreateRewardsPool({ user_id: userId });
      }

      // 根据交易类型计算新余额
      const newBalance = this.calculateNewBalance(
        wallet.balance,
        amount,
        txnType
      );

      // 更新钱包信息
      const updated = await app.model.RewardsPool.update(
        {
          balance: parseFloat(newBalance),
          total_in:
            txnType === "RETURN"
              ? parseFloat(wallet.total_in) + parseFloat(amount)
              : parseFloat(wallet.total_in),
          total_out:
            txnType === "CONSUME"
              ? parseFloat(wallet.total_out) + parseFloat(amount)
              : parseFloat(wallet.total_out),
          frozen:
            txnType === "FROZEN"
              ? parseFloat(wallet.frozen) + parseFloat(amount) // 新增冻结类型
              : txnType === "RETURN"
              ? parseFloat(wallet.frozen) + parseFloat(amount)
              : parseFloat(wallet.frozen),
          lastModifiedTime: new Date(),
          version: wallet.version + 1,
        },
        {
          where: {
            user_id: userId,
            version: wallet.version, // 乐观锁
          },
          transaction,
        }
      );

      if (updated[0] === 0) throw new Error("并发更新冲突");

      // 2. 创建交易记录
      const txnNo = this.generateTxnNo();
      await app.model.Rewards.createReward(
        {
          user_id: userId,
          txn_type: txnType,
          txn_no: txnNo,
          order_id: orderId,
          amount,
          balance_after: newBalance,
          remark: remark || this.getDefaultRemark(txnType),
          description,
        },
        { transaction }
      );

      return { newBalance, txnNo };
    });
  }

  async thawBalance(params = {}) {
    const { app } = this;
    const { userId, orderId, amount } = params;

    return await app.transaction(async transaction => {
      const wallet = await app.model.RewardsPool.findOne({
        where: { user_id: userId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!wallet) throw new Error("钱包不存在");
      if (wallet.frozen < amount) throw new Error("冻结金额不足");

      const newFrozen = wallet.frozen - amount;

      const updated = await app.model.RewardsPool.update(
        {
          frozen: newFrozen,
          version: wallet.version + 1,
          lastModifiedTime: new Date(),
        },
        {
          where: {
            user_id: userId,
            version: wallet.version,
          },
          transaction,
        }
      );

      if (updated[0] === 0) throw new Error("并发更新冲突");

      await app.model.Rewards.update(
        {
          txn_type: "REFUND",
          remark: `解冻资金:${orderId}, 订单返还 ${amount} 金额`,
        },
        {
          where: { user_id: userId, order_id: orderId },
          transaction,
        }
      );

      return { newFrozen };
    });
  }

  generateTxnNo() {
    return `TXN${Date.now()}${Math.random().toString().slice(2, 8)}`;
  }

  calculateNewBalance(currentBalance, amount, txnType) {
    const operations = {
      CONSUME: () => currentBalance - amount,
      ORDER_REBATE: () => currentBalance + amount,
      REFUND: () => currentBalance + amount,
      ADJUST: amount => amount, // 直接设置为指定金额
      FROZEN: () => currentBalance, // 新增冻结类型
    };
    return operations[txnType](amount);
  }

  getDefaultRemark(txnType) {
    const remarks = {
      CONSUME: "商品消费",
      ORDER_REBATE: "订单返还",
      REFUND: "系统退款",
      ADJUST: "人工调账",
      FROZEN: "冻结资金",
    };
    return remarks[txnType] || "钱包交易";
  }
}

module.exports = Rewards_poolService;
