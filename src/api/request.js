import axios from "axios";
import { message } from "antd"

const withTokenRequest = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

// 3. 请求拦截器
withTokenRequest.interceptors.request.use(
  (config) => {
    // 获取 Token
    const token = sessionStorage.getItem('token') || "fake-random-token-for-demo";
    if (token && config.headers) {
      config.headers.Authorization = token;
    }

    // TODO: 可以在这里开启全局 Loading

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. 响应拦截器
withTokenRequest.interceptors.response.use(
  (response) => {
    // TODO: 可以在这里关闭全局 Loading

    console.log(response)
    const { code, msg, data } = response.data;

    // 假设业务成功码为 200
    if (code === 200) {
      message.success('上传成功！已返回结果')
      return data; // 脱壳，直接返回业务数据
    }

    // 处理特定业务错误，例如 Token 过期
    if (code === 401) {
      // 执行登出逻辑，跳转登录页
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      // 统一业务错误提示 (这里假设有个 Toast 方法)
      message.error({
        content: msg || '系统异常',
        duration: 3,
        key: msg || '系统异常',
      });
      console.error(msg || '系统异常');
    }

    // 返回 reject 让业务代码进入 catch
    return Promise.reject(new Error(msg || 'Error'));
  },
  (error) => {
    // TODO: 可以在这里关闭全局 Loading

    let errmessage = '';
    const status = error.response?.status;

    // HTTP 状态码错误处理
    switch (status) {
      case 400: errmessage = '请求参数错误'; break;
      case 401: errmessage = '未授权，请登录'; break;
      case 403: errmessage = '拒绝访问'; break;
      case 404: errmessage = '请求地址错误'; break;
      case 500: errmessage = '服务器内部错误'; break;
      default: errmessage = '网络连接异常，请稍后再试';
    }

    // 处理请求超时
    if (error.message.includes('timeout')) {
      errmessage = '请求超时，请检查网络';
    }

    // 统一提示错误
    message.error({
      content: errmessage,
      duration: 3,
      key: errmessage,
    });

    console.error(errmessage);

    return Promise.reject(error);
  }
);

const withoutTokenRequest = axios.create({
  baseURL: '/api',
  timeout: 8000,
    headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

withoutTokenRequest.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data;
    if (code === 200) {
      return data;
    }
    // console.error(msg || '系统异常');
    return Promise.reject(new Error(msg || 'Error'));
  },
  (error) => {
    console.log("111",error.response)
    let errmessage = '';
    const status = error.response?.status;
        switch (status) {
      case 400: errmessage = error.response?.data?.msg || '请求参数错误'; break;
      case 401: errmessage = error.response?.data?.msg || '未授权，请登录'; break;
      case 403: errmessage = error.response?.data?.msg || '拒绝访问'; break;
      case 404: errmessage = error.response?.data?.msg || '请求地址错误'; break;
      case 500: errmessage = error.response?.data?.msg || '服务器内部错误'; break;
      default: errmessage = error.response?.data?.msg || '网络连接异常，请稍后再试';
    }
    if (error.message.includes('timeout')) {
      errmessage = '请求超时，请检查网络';
    }

        message.error({
      content: errmessage,
      duration: 3,
      key: errmessage,
    });

    console.error(errmessage);

    return Promise.reject(error);
  }
);

withoutTokenRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export { withTokenRequest, withoutTokenRequest };