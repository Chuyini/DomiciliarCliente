import { Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { GratitudeComponent } from './pages/gratitude/gratitude.page';
import { LoadPage } from './pages/load/load.page';

export const routes: Routes = [
    { path: "", component: HomePage },
    { path: "gratitude", component: GratitudeComponent },
    { path: "load", component: LoadPage }
];
