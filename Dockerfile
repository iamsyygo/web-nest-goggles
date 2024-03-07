FROM node:18.0.0

# 设置时区

# 创建工作目录
RUN mkdir -p /home/app

# 指定工作目录
WORKDIR /home/app

# 复制当前代码到指定工作目录
COPY . ./

# 选用国内镜像源以提高下载速度
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖，先 copy package.json 是为利用 docker 缓存，只有 package.json 变化时才会重新安装依赖
COPY package.json /home/app/package.json
RUN cd /home/app
RUN rm -rf pnpm-lock.yaml node_modules
RUN npx pnpm install

# 打包
RUN cd /home/app && rm -rf dist &&  npm run build

# 启动服务
CMD npm run start:prod

EXPOSE 8080
