import { combineReducers } from 'redux'
import Auth from './Auth'
import program from './program'
import module from './module'
import task from './task'
import lesson from './lesson'
import curator from './curator'

const RootReducer = combineReducers({ Auth, program, module, task, lesson, curator })

export default RootReducer