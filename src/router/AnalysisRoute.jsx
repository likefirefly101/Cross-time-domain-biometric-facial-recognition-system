import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import AnalysisPageContent from '../components/AnalysisPageContent/AnalysisPageContent'
import routeObj from '../utils/RouteConfig'

function AnalysisRoute() {
  return (
    <>
      <Route path={routeObj.dashboard.analysis.root} element={<Navigate to={routeObj.dashboard.analysis.individual} replace />} />
      <Route path={routeObj.dashboard.analysis.individual} element={<AnalysisPageContent />} />
      <Route path={routeObj.dashboard.analysis.team} element={<AnalysisPageContent />} />
    </>
  )
}

export default AnalysisRoute