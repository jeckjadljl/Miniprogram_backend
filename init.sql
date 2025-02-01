-- 设置 root 用户的认证插件为 mysql_native_password
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'chz123';
-- 也可以设置 root 用户在 localhost 上的认证插件
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'chz123';
-- 如果有其他用户需要设置，可以按照类似的方式进行配置