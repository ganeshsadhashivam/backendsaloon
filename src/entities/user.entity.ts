import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";
import { UserProfile } from "./userProfile.entity";

@Entity("users")
export class User extends Model {
  @Index("email_index")
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: true,
  })
  verified: boolean;

  
  @OneToOne(() => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }
}
