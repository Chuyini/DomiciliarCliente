
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

//import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import { jsPDF } from 'jspdf';



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

  emailPerson: any = "";

  checked: boolean = false;

  //*****************************ARCHIVS**********************************
  bankFileName: string = '';
  zipFileName: string = '';


  fileZip: File | null = null;

  dayPayOpen: any;


  typeService = [
    { id: 1, type: "Residencial 10 Megabits/s" },
    { id: 2, type: "Residencial 20 Megabits/s" },
    { id: 3, type: "Residencial 30 Megabits/s" },
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

  generatePDF() {
    const doc = new jsPDF();
    let y = 10; // posición vertical inicial

    const addLine = (text: string, space = 10) => {
      doc.text(text, 10, y);
      y += space;
    };

    // Sección: Encabezado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    addLine('ALTA DE CLIENTES');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    addLine(`Fecha: ${new Date().toLocaleDateString()}`);
    addLine(`Hora: ${new Date().toLocaleTimeString()}`);
    addLine(`Entidad: ${this.entity}`);
    addLine(`Teléfono: ${this.telPerson}`);
    addLine(`Email: ${this.emailPerson}`);
    addLine('----------------------------------------');
    // Sección: Datos del Cliente
    addLine(`Nombre del Cliente: ${this.numNameClient}`);
    addLine(`Tipo de Servicio: ${this.typeServiceSelected}`);
    addLine(`Plazo de Contratación: ${this.hiringPeriodSelected}`);
    addLine(`Titular de la Cuenta: ${this.holder}`);
    addLine(`Número de Cuenta: ${this.numAccount}`);
    addLine(`Fecha de Vencimiento: ${this.dueDate}`);
    addLine(`Domicilio: ${this.address}`);
    addLine(`Cantidad Total: ${this.cantT}`);
    addLine(`Días de Cargo: ${this.dayPaySelected}`);
    addLine('----------------------------------------');
    // Sección: Términos y Condiciones
    addLine('Términos y Condiciones:');
    addLine('1. El cliente acepta los términos y condiciones del servicio.');

    doc.save('Domiciliacion_Pdnt.pdf');
  }



  public useNodeMailer(emails: any) {
    console.log("Desde la funcion useNodeMailer: ", emails);




    let base64Zip: string | null = null;

    // Crearemos dos FileReader, pero solo si existen los archivos


    let readerZip: FileReader | null = null;

    // Función para INTENTAR enviar el correo cuando tengamos la info necesaria
    const trySendEmail = () => {
      // Construir el array de attachments
      const attachmentsArray = [];


      if (base64Zip) {
        attachmentsArray.push({
          filename: 'DocumentosComprimidos.zip',
          content: base64Zip,
          encoding: 'base64'
        });
      }

      // Construir el body con ambos adjuntos
      const body = {
        to: emails,
        subject: 'DOMICILIACION DE CLIENTES',
        text: `¡Hola! te entrego el Alta de clientes: ${this.emailPerson} 💳 😊👌 ➡️`,
        attachments: attachmentsArray,
        variables: [
          {
            entidad: this.entity,
            telPerson: this.telPerson,
            emailPerson: this.emailPerson,
            numNameClient: this.numNameClient,
            typeServiceSelected: this.typeServiceSelected,
            hiringPeriodSelected: this.hiringPeriodSelected,
            holder: this.holder,
            numAccount: this.numAccount,
            dueDate: this.dueDate,
            address: this.address,
            cantT: this.cantT,
            dayPaySelected: this.dayPaySelected

          }
        ]
      };

      this.generatePDF();

      // Enviar la petición al servidor 

      //https://email-own.vercel.app/send-email
      axios.post('https://emailown-production.up.railway.app/send-email-domic', body)
        .then(response => {
          console.log('Archivos enviados exitosamente:', response);
          this.router.navigate(['/gratitude']);
        })
        .catch(error => {
          console.error('Error al enviar los archivos', error);
        });
    };


    // Lógica para leer el ZIP (si existe)
    if (this.fileZip) {
      readerZip = new FileReader();
      readerZip.onload = () => {
        base64Zip = (readerZip!.result as string).split(',')[1];
        // Verificamos si no hay PDF o si PDF ya está listo

        trySendEmail();

      };
      readerZip.readAsDataURL(this.fileZip);
    }

    // Si no hay PDF ni ZIP, enviamos sin adjuntos
    if (!this.fileZip) {
      trySendEmail();
    }
  }





  public async submitAll(): Promise<void> {
    if (this.numNameClient === "" || this.dueDate === "" || this.cantT === "" || this.dayPaySelected === "") {
      this.snackBar.open('Por favor, complete todos los campos obligatorios.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      return;
    }
    if (this.checked === false) {
      this.snackBar.open('Por favor, acepte los términos y condiciones.', 'Cerrar', {
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
        await this.useNodeMailer(email);
        console.log("Respuesta del servidor: ");


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
