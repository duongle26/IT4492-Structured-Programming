import { Component, OnInit, ViewChild } from "@angular/core";
import { ListOrderService } from "./list-order.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-list-order",
  templateUrl: "./list-order.component.html",
  styleUrls: ["./list-order.component.css"]
})
export class ListOrderComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public WarningMessageText = "Request to get list items failed:";
  public WarningMessageOpen = false;
  public startValue: number;
  public endValue: number;
  public status: string;
  public displayedColumns = ["id", "date", "products", "value", "status"];
  public dataSource: any;

  public params = {
    sort: "DSC",
    quantity: 100,
    startTime: "",
    endTime: "",
    startValue: this.startValue || "",
    endValue: this.endValue || "",
    status: this.status || "",
    query: ""
  };

  constructor(private listOrderService: ListOrderService) {}

  ngOnInit() {
    this.renderList();
  }

  renderList() {
    this.listOrderService.getListOrder(this.params).subscribe(
      response => {
        response.forEach(
          el =>
            (el.productsName = el.products.map(prod => prod.name).join(", "))
        );
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.WarningMessageOpen = true;
        this.WarningMessageText = `Request to get list items failed: ${error}`;
      }
    );
  }

  handleSearch(inputText: string) {
    this.params.query = inputText;
    this.renderList();
  }

  onOptionsSelected(value: string) {
    if (value) {
      this.params.status = value;
      this.renderList();
    }
  }

  onDateChange(event: any) {
    this.params.startTime = event.startDate;
    this.params.endTime = event.endDate;
    this.renderList();
  }
}
