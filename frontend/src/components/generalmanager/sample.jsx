<Route path="/" element={<GeneralmanagerDashboard />} />
<Route path="/plan/View" element={<GeneralmanagerSubmittedViewPlan />} />
<Route path="/report/Viewapprovedreport" element={<GeneralmanagerSubmittedViewReport />} />
<Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
<Route path="/plan/View_myplan" element={<GeneralmanagerViewPlan />} />
<Route path="/report/View_myreport" element={<GeneralmanagerViewReport />} />
<Route path="/report/view/update/:reportId" element={<UpdateReport />} />
<Route path="/plan/view/add-report/:planId" element={<AddReport />} />
<Route path="/plan/ViewOrgPlan" element={<GeneralmanagerViewOrgPlan />} />
<Route path="/report/ViewOrgReport" element={<GeneralmanagerViewOrgReport />} />
<Route path="/report/GeneralmanagerViewDeclinedReport" element={<GeneralmanagerViewDeclinedReport />} />
<Route path="/plan/GeneralmanagerViewDeclinedPlan" element={<GeneralmanagerViewDeclinedPlan/>} />
<Route path="/plan/GeneralmanagerViewDeclinedPlan/view/update/:planId" element={<GeneralmanagerUpdatePlan />} />
<Route path="/plan/View_myplan/add-report/:planId" element={<GeneralmanagerAddReport />} />

      {/* update the plan */}
<Route path="/plan/View_myplan/update/:planId" element={<GeneralmanagerUpdatePlan />} />

      {/* 