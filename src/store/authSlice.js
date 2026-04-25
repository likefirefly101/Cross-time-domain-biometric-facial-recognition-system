import { createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, registerApi, sendCodeApi, changeNicknameApi, changePasswordApi } from "../api/userApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

const defaultThirdPartyBindings = {
  mailbox: { label: '邮箱', value: '已绑定', bound: true },
  qq: { label: 'QQ', value: '未绑定', bound: false },
  wechat: { label: '微信', value: '未绑定', bound: false },
  telephone: { label: '手机号', value: '未绑定', bound: false },
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (data, thunkApi) => {
    const response = await loginApi(data);
    thunkApi.dispatch(login(response));
    // return response;
  }
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (data) => {
    return await registerApi(data);
  }
);

export const sendCodeAsync = createAsyncThunk(
  "auth/sendCode",
  async (email) => {
    return await sendCodeApi(email);
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      await logoutApi();
    } finally {
      // 无论服务端退出接口是否成功，本地都清理登录态
      thunkApi.dispatch(logout());
    }
  }
);

export const changeNicknameAsync = createAsyncThunk(
  "auth/changeNickname",
  async (data) => {
    await changeNicknameApi(data);
    return data?.newUsername ?? '';
  }
);

export const changePasswordAsync = createAsyncThunk(
  "auth/changePassword",
  async (data) => {
    await changePasswordApi(data);
    return data?.newPassword ?? '';
  }
);


const authSlice = createSlice({
    name: "auth",
    initialState: {
      isLogin: sessionStorage.getItem('token') ? true : false,
      token: sessionStorage.getItem('token') || null,
      userId: 1,
      username: localStorage.getItem('username') || null, //登录后用户再进行设置
      thirdPartyBindings: defaultThirdPartyBindings,
    },
    reducers: {
      login(state, action) {
        const { token, userId, username } = action.payload;
        state.isLogin = true;
        state.token = token;
        state.userId = 1;
        state.username = username || localStorage.getItem('username') || null;
        sessionStorage.setItem('token', token);
      },
      logout(state) {
        state.isLogin = false;
        state.token = null;
        state.userId = null;
        state.username = null;
        state.thirdPartyBindings = defaultThirdPartyBindings;
        sessionStorage.removeItem('token');
      },
      setThirdPartyBinding(state, action) {
        const { key, value, bound } = action.payload || {};
        if (!key || !state.thirdPartyBindings[key]) {
          return;
        }
        state.thirdPartyBindings[key] = {
          ...state.thirdPartyBindings[key],
          value: value ?? state.thirdPartyBindings[key].value,
          bound: typeof bound === 'boolean' ? bound : state.thirdPartyBindings[key].bound,
        };
      },
    },
    extraReducers: (builder) => {
      builder.addCase(changeNicknameAsync.fulfilled, (state, action) => {
        state.username = action.payload;
      });
    },
});

export const { login, logout, setThirdPartyBinding } = authSlice.actions;
export default authSlice.reducer;
