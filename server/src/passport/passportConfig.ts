import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usernamePasswordSchema } from "../../../shared/constants";
import { prisma } from "../db/prisma";
import { User } from "@prisma/client";



passport.deserializeUser((id: string, done) => {

});


passport.serializeUser((user: any, done) => {
    done(null, (user as User).id);
    
});



passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    
    const userNameResult = usernamePasswordSchema.safeParse(username);
    if (!userNameResult.success) {
        return done(null, false, { message: userNameResult.error.issues[0].message });
    }

    const passwordResult = usernamePasswordSchema.safeParse(password);
    if (!passwordResult.success) {
        return done(null, false, { message: passwordResult.error.issues[0].message });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username }  });
        if (!user) {
            return done(null, false, { message: 'Username not found in our databse!!!' });
        }

        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password!!!' });
        }

        return done(null, user);

    } catch (err: unknown) {
        return done(err, false);

    }

}));