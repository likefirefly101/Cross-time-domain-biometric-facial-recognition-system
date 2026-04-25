import { Navigate , useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";

function RequireAuthRouter({ children }) {
    const location = useLocation()
    const isLogin = useSelector((state) => state.auth.isLogin)

    if (!isLogin) {
        // 如果用户未登录，重定向到登录页，并保留当前路径以便登录后返回
        message.error({
            content: '无权进入，请先登录',
            duration: 3,
            key: 'login_required'
        });
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // 如果用户已登录，正常渲染子组件
    return children;
}

export default RequireAuthRouter

