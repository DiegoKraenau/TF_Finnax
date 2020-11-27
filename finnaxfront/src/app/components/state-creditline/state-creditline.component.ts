import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/entities/customer';
import { Payment } from 'src/app/entities/payment';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { jsPDF } from "jspdf";
import { Purchase } from 'src/app/entities/purchase';
import { DatePipe } from '@angular/common'
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-state-creditline',
  templateUrl: './state-creditline.component.html',
  styleUrls: ['./state-creditline.component.css'],
  providers: [DatePipe]
})
export class StateCreditlineComponent implements OnInit {

  payments=new Array<Payment>();
  pageActual=1;
  customer=new Customer();
  totalPayment:number=0;
  purchases=new Array<Purchase>();
  restante:Number;

  constructor(private customerService:CustomerService,private rutaActiva:ActivatedRoute,private router:Router,public datepipe: DatePipe,private paymentService:PaymentService) { }

  ngOnInit(): void {
    const customerId=this.rutaActiva.snapshot.params.customerId;
    this.customerService.findPaymentsByCustomerId(customerId).subscribe(
      response=>{
        this.payments=response;
        this.payments.forEach(element => {
          this.totalPayment=this.totalPayment+element.paymentAmount;
        });
      }
    );

    this.customerService.findCustomerById(customerId).subscribe(
      response=>{
        this.customer=response;
        this.customer.customerTotalDebt = Number(this.customer.customerTotalDebt.toFixed(2));
        this.customer.customerCreditAvailable = Number(this.customer.customerCreditAvailable.toFixed(2));
        this.restante=Number(this.customer.customerCreditLine.toFixed(2))-Number(this.customer.customerTotalDebt.toFixed(2));
      }
    );

    this.customerService.purchasesByCustomerId(customerId).subscribe(
      response=>{
        this.purchases=response;
      }
    );

   
    

   
  }

  deletePurchase(i:string,id:string){
    const index: number = this.payments.indexOf(this.payments[i]);
    if (index !== -1) {
      this.payments.splice(index, 1);
  } 
   this.paymentService.deletePayment(id).subscribe(
     response=>{
       console.log(response)
     }
   )
  }

  registerPayment(){
    const customerId=this.rutaActiva.snapshot.params.customerId;
    this.router.navigate(['/register-payment/'+customerId]);
  }

  descargarPDF(){
    var date=new Date();
    let latest_date =this.datepipe.transform(date, 'yyyy-MM-dd');
    const doc = new jsPDF();
    var i=48
    doc.setFont('bold')
    doc.text("Cliente: "+this.customer.customerName,8,8)
    doc.text("Generado: "+latest_date.toString(),128,8)
    doc.setFontSize(10)
    doc.text("Total pagado: "+this.totalPayment+'$',8,18)
    doc.text("Deuda: "+this.customer.customerTotalDebt+'$',78,18)
    doc.text("Linea de credito restante: "+this.customer.customerCreditAvailable+'$',128,18)
    doc.setFontSize(13)
    doc.text("Pagos:",8,28)
    doc.setFontSize(10)
    doc.text("Nombre",8,38)
    doc.text("Fecha",80,38)
    doc.text("Monto",138,38)
    this.payments.forEach(element => {
      //this.totalPayment=this.totalPayment+element.paymentAmount;
      doc.text(element.paymentName.toString(), 8, i);
      doc.text(element.operationDate.toString(), 80, i);
      doc.text(element.paymentAmount.toString()+'$', 138, i);
      i=i+10
    });
    doc.setFontSize(13)
    doc.text("Compras:",8,i)
    i=i+10
    
    this.purchases.forEach(element => {
      //this.totalPayment=this.totalPayment+element.paymentAmount
      doc.setFontSize(10)
      doc.setFont('bold')
      doc.setTextColor(0, 0, 255)
      doc.text(element.purchaseName.toString(), 8, i);
      doc.text("Delivery: "+element.deliveryAmount.toString()+"$", 80, i);
      doc.text("Fecha: "+element.operationDate.toString(), 138, i);
      doc.setTextColor(0, 0, 0)
      i=i+10
      doc.setFontSize(10)
      doc.setFont("italic")
      doc.text("Producto",8,i)
      doc.text("Monto",138,i)
      i=i+10
      element.listaProducts.forEach(p=>{
        doc.text(p.productDescription,8,i)
        doc.text(p.productAmount+"$",138,i)
        i=i+10
      })
      
     i=i+10
      
      
    });
    


  
  doc.save("EstadoDeCuenta-"+this.customer.customerName+".pdf");


  }

}
