import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        // 预设账户信息
        presetAccount: {
            phoneNumber: '13990251809',
            password: '123456',
            email: '3259528546@qq.com',
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGktY2xpZW50IiwiaWF0IjoxNzczOTg3OTY4LCJleHAiOjE3NzY1Nzk5Njh9.Ehta1Ed3UHA2_Gt3X6RdFWYh8XDIxQXW5mfEDSwTa-8',
            userInfo: {
                userId: '667890',
                phoneNumber: '13990251809',
                name: '测试用户'
            }
        },
        currentUser: null,
    },
    reducers: {},
});

export default userSlice.reducer;
