import express from 'express';
const router = express.Router();

import { create_user } from '../../controllers/user.controller';
import { get_users } from "../../controllers/user.controller";
/// get all users

router.post('/create-user', create_user)

router.get('/get-users', get_users)
export default router;