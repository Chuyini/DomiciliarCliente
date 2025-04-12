
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

//import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';

@Component({
  selector: 'app-form',
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  constructor(private snackBar: MatSnackBar, private router: Router,) { }
  //************************DATOS FISCALES**********************************
  public entity = "El Poder de Internet, S.A. de C.V.";

  telPerson: any = "";

  emailPerson: any = "genesis ";

  //*****************************ARCHIVS**********************************
  bankFileName: string = '';
  zipFileName: string = '';

  fileBank: File | null = null;
  fileZip: File | null = null;



  typeService = [
    { id: 1, type: "10 Megabits/s" },
    { id: 2, type: "20 Megabits/s" },
    { id: 3, type: "30 Megabits/s" },
  ]

  typeServiceSelected: any;
  numNameClient: any;
  hiringPeriod = [
    { id: 1, period: "6 Meses" },
    { id: 2, period: "12 Meses" },
    { id: 3, period: "24 Meses" },
    { id: 4, period: "36 Meses" },
  ]
  daysPay = [

    { id: 1, "day": "1" },
    { id: 2, "day": "15" },
    { id: 3, "day": "25" }

  ];
  hiringPeriodSelected: any;
  holder: any;
  numAccount: any;
  dueDate: string = "";
  address: any;
  cantT: any;
  dayPaySelected: any;




  public printAllData(): void {

    const now = new Date();
    console.log('******** INFORMACION DE DOMICILIACION**********');
    console.log(`San Luis Potosí, S.L.P., ${now}`);
    console.log('Nombre de cliente con id:', this.numNameClient);
    console.log('tipo de servicio', this.typeServiceSelected);
    console.log("Plazo de contratacion; ", this.hiringPeriodSelected);
    console.log("Titular de la cuenta: ", this.holder);
    console.log("No. de cuenta: ", this.numAccount);
    console.log('celular:', this.telPerson);
    console.log("Fecha de vencimiento", this.dueDate);
    console.log('Domicilio:', this.address);
    console.log('Email: ', this.emailPerson);
    console.log('cantidad total: ', this.cantT);
    console.log('Dias de cargo:', this.dayPaySelected);



  }








  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'zipFile') {
        console.log('Archivo seleccionado:', input.files[0].name);
        this.zipFileName = input.files[0].name;
      }
    } else {
      console.log('Ningún archivo seleccionado');
    }
  }


  public async useNodeMailer(email: string) {
    console.log("Desde la funcion useNodeMailer: ", email);
    const now = new Date();

    let responsi;
    // Variable para almacenar base64 del ZIP
    let base64Zip: string | null = null;

    const trySendEmail = () => {
      const attachmentsArray = [];

      if (base64Zip) {
        attachmentsArray.push({
          filename: 'DocumentosComprimidos.zip',
          content: base64Zip,
          encoding: 'base64'
        });
      }

      const body = {
        to: email,
        subject: 'AUTORIZACION PARA DOMICILIAR CLIENTE',
        text: '¡Hola! Domiciliacion de Cliente de clientes adjunto archivo ZIP',
        attachments: attachmentsArray,
        variables: {
          location: 'San Luis Potosí, S.L.P.',
          timestamp: now,
          clientId: this.numNameClient,
          serviceType: this.typeServiceSelected,
          hiringPeriod: this.hiringPeriodSelected,
          accountHolder: this.holder,
          accountNumber: this.numAccount,
          phoneNumber: this.telPerson,
          dueDate: this.dueDate,
          address: this.address,
          email: this.emailPerson,
          totalAmount: this.cantT,
          paymentDays: this.dayPaySelected
        }
      };

      axios.post('https://email-own.vercel.app/send-email-domic', body)
        .then(response => {
          console.log('Éxito:', response);
          let resposi= response;
          return response;
        })
        .catch(error => {
          console.error('Error:', error);
          
          return error;
        });
    };

    // Lógica para ZIP
    if (this.fileZip) {
      const readerZip = new FileReader();
      readerZip.onload = async () => {
        base64Zip = (readerZip.result as string).split(',')[1];
        await trySendEmail();
      };
      readerZip.readAsDataURL(this.fileZip);
    } else {
      // Caso sin archivos ZIP
      await trySendEmail();
    
    }
    return "";

}


public async submitAll(): Promise<void> {
  if (this.telPerson === "" || this.emailPerson === "") {
    this.snackBar.open('Por favor, complete todos los campos obligatorios.', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
    return;
  }

  if ((this.fileZip?.size ?? 0) > 10 * 1048576) {
    this.snackBar.open('El archivo debe ser un PDF y el ZIP debe tener un tamaño máximo de 10MB.', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
    return;
  }

  if (this.fileZip) {
    const zipOk = this.fileZip.name.toLowerCase().endsWith('.zip');
    if (!zipOk) {
      this.snackBar.open('El archivo ZIP debe tener extensión .zip.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      return;
    }
  }

  try {
    const email = 'jmlr231201@gmail.com';
    console.log("Correo seleccionado: ", email);

    if (email) {
      const response = await this.useNodeMailer(email);
      console.log("Respuesta del servidor: ", response);

      if (response) {
        // Navega solo si la respuesta indica éxito
        this.router.navigate(['/gratitude']);
        console.log("Éxito al mandar el correo: ", email);
      } else {
        console.log("El servidor no respondió correctamente.");
        this.snackBar.open('Error al enviar el correo. Por favor, intente nuevamente.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    }
  } catch (error) {
    console.log("Ocurrió el siguiente error: ", error);
    this.snackBar.open('Ocurrió un error al enviar el correo. Por favor, intente nuevamente.', 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  console.log("No termina");
}
}
