import { Component } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  imports: [FormComponent,HeaderComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {

}
