import { NextFunction, Request, Response } from 'express';
import { getUserProfileByNickname, getprofile } from '../services/userProfile.service';


export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const email=res.locals.user.email;


   const userprofile = await getprofile(email);
   const user = res.locals.user;
    //const name=res.locals.userProfile.nickname;
   console.log(userprofile)

    res.status(200).status(200).json({
      status: 'success',
      data: {
        userprofile,
        user,
        //userName
      
      },
    });
  } catch (err) {
    next(err);
  }
};


