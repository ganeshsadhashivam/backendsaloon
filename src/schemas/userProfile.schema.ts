import { TypeOf, object, string } from "zod";




const toDateObject = (value: string): Date => {
    // Convert the string date to a Date object
    return new Date(value);
  };
  
export const createProfileSchema = object({
    body:object({
 // As id is generated by the database, it's optional in the schema
    image: string({
      required_error: 'Image is required',
    }), 
    fullName: string({ required_error: 'Full name is required' }),
    nickname: string({ required_error: 'Nickname is required' }),
    dateOfBirth:  string().transform(toDateObject).optional(), 
    email: string({ required_error: 'Email address is required' }).email('Invalid email address'),
    mobileNumber: string({ required_error: 'Mobile number is required' }),
    gender: string({ required_error: 'Gender is required' }),
  })
});
export type CreateProfileSchema = TypeOf<typeof createProfileSchema>['body'];