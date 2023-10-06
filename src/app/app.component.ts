import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  apiGetEndpoint: string = 'https://sheet.best/api/sheets/32f80b64-cbfe-49a6-b7ad-63ce74dcd800'
  list: any
  dataReady:boolean = false
  showForm: boolean =  false
  updateLoaderMsg = ''
  nomeConvidado: string = ''
  selectedItem: number = 0
  dataUpdated: boolean = false
  inputError: boolean = false
  
  
  constructor(private http: HttpClient){

  }

  ngOnInit(): void {

    // Obtendo os dados da lista de presentes
    this.setItensList()

  }

  setItensList(){
    this.dataReady = false
    this.updateLoaderMsg = ''
    this.http.get(this.apiGetEndpoint).subscribe({
      next: (res)=>{
        console.log('Resposta', res)
        this.list = res
        this.dataReady = true
      },
      error: (error)=>{
        console.error('Erro', error)
      }
    })
  }

  updateItem(){
    if(!this.nomeConvidado){
      // Campo não preenchido
      this.inputError = true
    }else{
      // Atualizando
      this.inputError = false
      this.updateLoaderMsg = 'Aguarde... Estamos registrando sua escolha.'
      this.showForm = false
      let index = this.selectedItem
      const apiPostEndpoint: string = this.apiGetEndpoint + '/' + index
      console.log(apiPostEndpoint)
      const headers = new HttpHeaders({
        "Content-Type": "application/json"
      });

      this.list[this.selectedItem].Nome = this.nomeConvidado
      let itemToUpdate = this.list[this.selectedItem]

      this.http.patch(apiPostEndpoint, {Nome: this.nomeConvidado}, { headers })
      .subscribe({
        next:(res)=>{
          console.log('Atualizado!',res)
          this.updateLoaderMsg = ''
          this.dataUpdated = true
          console.log('obrigado', this.dataUpdated)
        },
        error:(error)=>{
          console.error('Erro atualizacao!',error)
        }
      })
    }
    
  }

  openFormItem(index:number){
    this.showForm = true
    this.selectedItem = index
  }

  backToList(){
    this.updateLoaderMsg = ''
    this.showForm = false
    if(this.dataUpdated){
      this.setItensList()
    }
    this.dataUpdated = false
  }

}
