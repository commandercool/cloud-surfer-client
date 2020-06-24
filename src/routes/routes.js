import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'info/:name',
        name: 'Info',
        component: () => import(/* webpackChunkName: "info" */ "src/pages/SubjectInfo.vue")
      },
      {
        path: 'overview',
        name: 'Overview',
        component: () =>
          import(/* webpackChunkName: "overview" */ "src/pages/Overview.vue")
      },
      {
        path: 'user',
        name: 'User',
        component: () => import(/* webpackChunkName: "profile" */ "src/pages/UserProfile.vue")
      }
      // {
      //   path: 'table-list',
      //   name: 'Table List',
      //   component: TableList
      // },
      // {
      //   path: 'typography',
      //   name: 'Typography',
      //   component: Typography
      // },
      // {
      //   path: 'icons',
      //   name: 'Icons',
      //   component: Icons
      // },
      // {
      //   path: 'maps',
      //   name: 'Maps',
      //   component: Maps
      // },
      // {
      //   path: 'notifications',
      //   name: 'Notifications',
      //   component: Notifications
      // },
      // {
      //   path: 'upgrade',
      //   name: 'Upgrade to PRO',
      //   component: Upgrade
      // }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
