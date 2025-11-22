
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
    { id: 4, type: "PYME 20 Megabits/s" },
    { id: 5, type: "PYME 30 Megabits/s" },
    { id: 6, type: "PYME 50 Megabits/s" },
    { id: 7, type: "PYME 100 Megabits/s" },
    { id: 8, type: "Empresarial 10 Megabits/s Dedicado" },
    { id: 9, type: "Empresarial 20 Megabits/s Dedicado" },
    { id: 10, type: "Empresarial 30 Megabits/s Dedicado" },
    { id: 11, type: "Empresarial 40 Megabits/s Dedicado" },
    { id: 12, type: "Empresarial 50 Megabits/s Dedicado" },
    { id: 13, type: "Empresarial 100 Megabits/s Dedicado" },
    { id: 14, type: "Empresarial 150 Megabits/s Dedicado" },
    { id: 15, type: "Empresarial 200 Megabits/s Dedicado" },


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
  bankSelected: any = { id: 0, nombre: "No seleccionado" };
  banks = [
    { "id": 1, "nombre": "ABC Capital" },
    { "id": 2, "nombre": "American Express Bank (México)" },
    { "id": 3, "nombre": "Banca Afirme" },
    { "id": 4, "nombre": "Banca Mifel" },
    { "id": 5, "nombre": "Banco Actinver" },
    { "id": 6, "nombre": "Banco Ahorro Famsa" },
    { "id": 7, "nombre": "Banco Autofin México" },
    { "id": 8, "nombre": "Banco Azteca" },
    { "id": 9, "nombre": "Banco Bancrea" },
    { "id": 10, "nombre": "Banco Base" },
    { "id": 11, "nombre": "Banco Compartamos" },
    { "id": 12, "nombre": "Banco Credit Suisse (México)" },
    { "id": 13, "nombre": "Banco del Bajio" },
    { "id": 14, "nombre": "Banco Forjadores" },
    { "id": 15, "nombre": "Banco Inbursa" },
    { "id": 16, "nombre": "Banco Inmobiliario Mexicano" },
    { "id": 17, "nombre": "Banco Interacciones" },
    { "id": 18, "nombre": "Banco Invex" },
    { "id": 19, "nombre": "Banco J.P. Morgan" },
    { "id": 20, "nombre": "Banco Mercantil del Norte (Banorte)" },
    { "id": 21, "nombre": "Banco Monex" },
    { "id": 22, "nombre": "Banco Multiva" },
    { "id": 23, "nombre": "Banco Nacional de México (Banamex)" },
    { "id": 24, "nombre": "Banco Pagatodo" },
    { "id": 25, "nombre": "Banco Regional de Monterrey" },
    { "id": 26, "nombre": "Banco Santander (México)" },
    { "id": 27, "nombre": "Banco Ve Por Mas" },
    { "id": 28, "nombre": "Banco Wal-Mart de México" },
    { "id": 29, "nombre": "Bancoppel" },
    { "id": 30, "nombre": "Bank of America México" },
    { "id": 31, "nombre": "Bank of Tokyo-Mitsubishi UFJ (México)" },
    { "id": 32, "nombre": "Bankaool" },
    { "id": 33, "nombre": "Bansi" },
    { "id": 34, "nombre": "Barclays Bank México" },
    { "id": 35, "nombre": "BBVA Bancomer" },
    { "id": 36, "nombre": "CiBanco" },
    { "id": 37, "nombre": "ConsuBanco" },
    { "id": 38, "nombre": "Deutsche Bank México" },
    { "id": 39, "nombre": "Fundación Donde Banco" },
    { "id": 40, "nombre": "HSBC México" },
    { "id": 41, "nombre": "Intercam Banco" },
    { "id": 42, "nombre": "Investa Bank" },
    { "id": 43, "nombre": "Scotiabank Inverlat" },
    { "id": 44, "nombre": "UBS Bank México" },
    { "id": 45, "nombre": "Volkswagen Bank" }
  ]





  public printAllData(): void {

    const now = new Date();
    console.log('******** INFORMACION DE DOMICILIACION**********');
    console.log(`Fecha: ${now.toLocaleDateString()}`);
    console.log("banco seleccionado: ", this.bankSelected.nombre);
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
      if (fileType === 'fileZip') {
        console.log('Archivo seleccionado:', input.files[0].name);
        this.zipFileName = input.files[0].name;
        this.fileZip = input.files[0];
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
    addLine(`Banco seleccionado: ${this.bankSelected.nombre}`);
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
        text: `¡Hola! te entrego DOMICILIACION DE CLIENTES: ${this.holder} 💳 😊👌 ➡️`,
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
      this.router.navigate(['/load']);
      //https://email-own.vercel.app/send-email
      axios.post('https://emailown.fly.dev/send-email-domic', body)
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
      const email = 'pagos@elpoderdeinternet.mx';
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
