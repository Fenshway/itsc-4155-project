import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { FlaskdataService } from '../services/flaskdata.service';
import { inject } from "@angular/core";

const ProfileResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(FlaskdataService).getGames();
}

export default ProfileResolver;