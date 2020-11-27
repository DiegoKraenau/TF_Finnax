import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Customer } from 'src/app/entities/customer';
import { CustomerService } from 'src/app/services/customer/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent implements OnInit {

  customer: Customer = new Customer();
  name: string;


  constructor(private customerService: CustomerService) {
    this.customer.interestId = 0;
    this.customer.rateId = 0;
    this.customer.capitalizationId = 0
  }

  ngOnInit(): void {

  }

  Registrar() {
    const sellerId = localStorage.getItem('sellerId');
    this.customer.sellerId = sellerId;
    this.customer.customerStatus = true;
    this.customer.customerCreditAvailable=this.customer.customerCreditLine;
    if (this.customer.customerCreditLine>0 && this.customer.customerCreditLine!=null && this.customer.customerMaintenanceDays>0
      && this.customer.customerMaintenanceDays!=null  && this.customer.customerMaintenanceAmount!=null  && this.customer.customerAmountInterest>0) {
      this.customerService.registerCustomer(this.customer).subscribe(
        response => {
          if (response != null) {
            Swal.fire(
              'Buen trabajo!',
              'El cliente se agrego de manera correcta!',
              'success'
            )
          }
        }
      );
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se deben rellenar todos los campos y no permitir valores negativos'
      })
    }
    
  }

  onOptionsSelected(value: Number) {
    if (value != 3 ) {
      this.customer.capitalizationId = 0;

    }
    if(value==1){
      this.customer.rateId=0;
    }
  }

  refresh(form: NgForm){
    form.reset();
  }

  validar(event: KeyboardEvent) {
    console.log(this.customer.customerMaintenanceAmount)

  }

}
