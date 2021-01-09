import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '', title: 'Common Setup', icon: 'menu-icon ti-layout', class: 'menu-toggle', groupTitle: false,
    submenu: [
        {
            path: '', title: 'Master', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
                { path: '/common-setup/uom', title: 'UOM', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/common-setup/currency', title: 'Currency', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/common-setup/calender', title: 'Calender', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/common-setup/term', title: 'Term', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/common-setup/location', title: 'Location', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/common-setup/reason', title: 'Reason', icon: '', class: '', groupTitle: false, submenu: [] },
            ]
            
        },
        // {
        //   path: '/', title: 'Transaction', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
        //     { path: '/', title: 'Transaction 1', icon: '', class: '', groupTitle: false, submenu: [] },
        //     { path: '/', title: 'Transaction 2', icon: '', class: '', groupTitle: false, submenu: [] }

        //   ]
        // }
    ] 
}, 
{
  path: '', title: 'Company Setup', icon: 'menu-icon ti-layout', class: 'menu-toggle', groupTitle: false,
  submenu: [
      {
          path: '', title: 'Master', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
              { path: '/company-setup/company', title: 'Company', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/company-setup/userform', title: 'Employee Registration', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/company-setup/transaction-type', title: 'Transaction Type', icon: '', class: '', groupTitle: false, submenu: [] },
            
          ] 
      }
  ]
},
{
  path: '', title: 'API Hub Setup', icon: 'menu-icon ti-layout', class: 'menu-toggle', groupTitle: false,
  submenu: [
      {
          path: '', title: 'Master', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
              { path: '/api-hub/define-standard-api-definition', title: 'Standard API Definition', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/api-hub/define-api', title: 'Define API', icon: '', class: '', groupTitle: false, submenu: [] }
          ]
      }
  ]
},
{
  path: '', title: 'Reconciliation', icon: 'menu-icon ti-layout', class: 'menu-toggle', groupTitle: false,
  submenu: [
      {
          path: '', title: 'Master', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
              { path: '/reconcilation/source', title: 'Define Source', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/reconcilation/define_reconcilation', title: 'Define Reconciliation', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/reconcilation/define_reconcilation_process', title: 'Define Reconciliation Process', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/reconcilation/sechedule_process', title: 'Schedule Process', icon: '', class: '', groupTitle: false, submenu: [] },
              { path: '/reconcilation/dispute_resolution', title: 'Dispute Resolution', icon: '', class: '', groupTitle: false, submenu: [] }
          ]
      }
  ]
},
{
    path: '', title: 'Workflow', icon: 'menu-icon ti-layout', class: 'menu-toggle', groupTitle: false,
    submenu: [
        {
            path: '', title: 'Master', icon: '', class: 'ml-sub-menu', groupTitle: false, submenu: [
                { path: '/workflow/define_workflow', title: 'Define Workflow', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/workflow/activity', title: 'Activity', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/workflow/level', title: 'Level', icon: '', class: '', groupTitle: false, submenu: [] },
                { path: '/workflow/workflow', title: 'Workflow', icon: '', class: '', groupTitle: false, submenu: [] },
            ]
        }
    ]
  }
];
