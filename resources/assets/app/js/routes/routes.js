import Login from '../pages/login'
import Register from '../pages/register'
import Programs from '../pages/programs'
import Program from '../pages/program'
import User from '../pages/user'
import ProfileEdit from '../pages/profileEdit'
import CuratorMembers from '../pages/curator/Members'
import CuratorMember from '../pages/curator/Member'
import ExpertMembers from '../pages/expert/Members'
import ExpertMember from '../pages/expert/Member'
import ForgotPassword from '../pages/forgotPassword'
import ResetPassword from '../pages/resetPassword'
import NoMatch from '../pages/noMatch'

const routes = [
    {
        path: '/login',
        exact: true,
        auth: false,
        component: Login
    },
    {
        path: '/register',
        exact: true,
        auth: false,
        component: Register
    },
    {
        path: '/forgot-password',
        exact: true,
        auth: false,
        component: ForgotPassword
    },
    {
        path: '/reset-password/:token/:email',
        exact: true,
        auth: false,
        component: ResetPassword
    },
    {
        path: '/',
        exact: true,
        auth: true,
        component: Programs
    },
    {
        path: '/programs/:program',
        exact: false,
        auth: true,
        component: Program
    },
    {
        path: '/users/:user',
        exact: false,
        auth: true,
        component: User
    },
    {
        path: '/profile/edit',
        exact: false,
        auth: true,
        component: ProfileEdit
    },
    {
        path: '/curator',
        exact: true,
        auth: true,
        roles: ['curator'],
        component: CuratorMembers
    },
    {
        path: '/curator/:member',
        exact: false,
        auth: true,
        roles: ['curator'],
        component: CuratorMember
    },
    {
        path: '/expert',
        exact: true,
        auth: true,
        roles: ['expert'],
        component: ExpertMembers
    },
    {
        path: '/expert/:member',
        exact: false,
        auth: true,
        roles: ['expert'],
        component: ExpertMember
    },
    {
        path: '',
        exact: true,
        auth: false,
        component: NoMatch
    }
]

export default routes