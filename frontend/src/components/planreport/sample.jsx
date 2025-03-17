            {/* Plan And report manager */}

            </>:state.role_id==9?
            <>
<Route path="/" element={<PlanreportDashboard />} />
<Route path="/plan/View" element={<PlanreportSubmittedViewPlan />} />
<Route path="/report/Viewapprovedreport" element={<PlanreportSubmittedViewReport />} />
<Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
<Route path="/plan/View_myplan" element={<PlanreportViewPlan />} />
<Route path="/report/View_myreport" element={<PlanreportViewReport />} />
<Route path="/report/view/update/:reportId" element={<UpdateReport />} />
<Route path="/plan/view/add-report/:planId" element={<AddReport />} />
<Route path="/plan/ViewOrgPlan" element={<PlanreportViewOrgPlan />} />
<Route path="/report/ViewOrgReport" element={<PlanreportViewOrgReport />} />
<Route path="/report/PlanreportViewDeclinedReport" element={<PlanreportViewDeclinedReport />} />
<Route path="/plan/PlanreportViewDeclinedPlan" element={<PlanreportViewDeclinedPlan/>} />
<Route path="/plan/PlanreportViewDeclinedPlan/view/update/:planId" element={<PlanreportUpdatePlan />} />
<Route path="/plan/View_myplan/add-report/:planId" element={<PlanreportAddReport />} />

      {/* update the plan */}
<Route path="/plan/View_myplan/update/:planId" element={<PlanreportUpdatePlan />} />

      {/* 