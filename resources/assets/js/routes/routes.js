import Login from '../pages/login'
import Register from '../pages/register'
import Programs from '../pages/programs'
import Program from '../pages/program'
import User from '../pages/user'
import ProfileEdit from '../pages/profileEdit'
import CuratorList from '../pages/curatorList'
import CuratorDialog from '../pages/curatorDialog'
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
        path: '/curator/:thread',
        exact: false,
        auth: true,
        roles: ['curator'],
        component: CuratorDialog
    },
    {
        path: '/curator',
        exact: false,
        auth: true,
        roles: ['curator'],
        component: CuratorList
    },
    {
        path: '',
        exact: true,
        auth: false,
        component: NoMatch
    }
]

export default routes