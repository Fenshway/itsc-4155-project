import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { FlaskdataService } from '../services/flaskdata.service';
import { inject } from "@angular/core";

const ProfileResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(FlaskdataService).getProfile(route.paramMap.get("id") as unknown as number || 0);
}

export default ProfileResolver;