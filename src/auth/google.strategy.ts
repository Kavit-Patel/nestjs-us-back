import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(){
        super({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:`${process.env.BASE_URL}/auth/google/callback`,
            scope:['email','profile']
        })

    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifiedCallback
      ): Promise<any> {
        try {
          const { id, emails, displayName } = profile;
          const user = {
            googleId: id,
            name: displayName,
            email: emails[0]?.value,
          };
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
}