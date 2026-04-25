import React from 'react'
import MainLayout from '../../components/Layout/MainLayout'
import TitlePageContent from '../../components/TitlePageContent/TitlePageContent'
import AnalysisPageContent from '../../components/AnalysisPageContent/AnalysisPageContent'
import DetailPageContent from '../../components/DetailPageContent/DetailPageContent'
import SettingPageContent from '../../components/SettingPageContent/SettingPageContent'
import Notfound from '../NotFound/Notfound'
import routeObj from '../../utils/RouteConfig'
import { Routes, Route, Navigate ,useLocation } from 'react-router-dom'
import { AnimatePresence } from "framer-motion";
import AnimateWrapper from '../../router/AnimateWrapper'
import RequireAuthRouter from '../../router/RequireAuthRouter'

function Main() {
        const location = useLocation()
    return (
        <MainLayout>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path={routeObj.dashboard.root} element={<AnimateWrapper><TitlePageContent /></AnimateWrapper>} />
                    <Route path={routeObj.dashboard.analysis.root} element={<RequireAuthRouter><Navigate to={routeObj.dashboard.analysis.individual} replace /></RequireAuthRouter>} />
                    <Route path={routeObj.dashboard.analysis.individual} element={<RequireAuthRouter><AnimateWrapper><AnalysisPageContent /></AnimateWrapper></RequireAuthRouter>} />
                    <Route path={routeObj.dashboard.analysis.team} element={<AnimateWrapper><AnalysisPageContent /></AnimateWrapper>} />
                    <Route path={routeObj.dashboard.detail.root} element={<RequireAuthRouter><Navigate to={routeObj.dashboard.detail.individual} replace /></RequireAuthRouter>} />
                    <Route path={routeObj.dashboard.detail.individual} element={<RequireAuthRouter><AnimateWrapper><DetailPageContent /></AnimateWrapper></RequireAuthRouter>} />
                    <Route path={routeObj.dashboard.detail.team} element={<RequireAuthRouter><AnimateWrapper><DetailPageContent /></AnimateWrapper></RequireAuthRouter>} />
                    <Route path={routeObj.dashboard.setting} element={<RequireAuthRouter><AnimateWrapper><SettingPageContent /></AnimateWrapper></RequireAuthRouter>} />
                    <Route path="*" element={<Notfound />} />
                </Routes>
            </AnimatePresence>
        </MainLayout>
    )
}

export default Main