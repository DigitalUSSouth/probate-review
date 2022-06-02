import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecordService } from '../record.service';
import { ProbateRecord } from '../probate-record';
import * as dragon from 'openseadragon'

interface SubcategoryOptionValue {
  value: string,
  text: string
}

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.sass']
})
export class RecordDetailComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;  

  private subcategoryMap: Map<string, Array<SubcategoryOptionValue>> = 
    new Map([
      ["identity", [
        {value:"record-identifier", text:"Record Identifier"}, 
        {value:"name-of-deceased", text:"Name of Deceased"},
        {value:"gender-of-deceased", text:"Gender of Deceased"},
        {value:"state-of-filing", text:"State of Filing"},
        {value:"county-of-filing", text:"County/District of Filing"},
        {value:"date-of-filing", text:"Date of Filing"},
        {value:"appraiser", text:"Appraiser(s)"},
        {value:"witness", text:"Witness(es)"},
        {value:"total-value", text:"Total Stated Value of Probate (in Dollars)"},
      ]],
      ["furniture", [
        {value:"bedding", text:"Bedding"}, 
        {value:"seating", text:"Seating"},
        {value:"table", text:"Table"},
        {value:"desk", text:"Desk"},
        {value:"washstand", text:"Washstand"},
        {value:"mirror", text:"Mirrors and looking Glasses"},
        {value:"clock", text:"Clock"},
        {value:"trunk", text:"Trunks and Storage, Safe"},
        {value:"lighting", text:"Lighting"},
        {value:"sideboard", text:"Sideboard"}, 
        {value:"clothing-storage", text:"Clothing Storage"},
        {value:"pictures", text:"Pictures"},
        {value:"carpets", text:"Carpets and Rugs"},
        {value:"fireplace-items", text:"Fireplace Items"},
        {value:"window-treatments", text:"Window Treatments"},
        {value:"other", text:"Other"},
      ]],
      [
        "kitchen", [
          {value:"flatware", text:"Flatware"}, 
          {value:"cups", text:"Cups and Mugs"},
          {value:"glassware", text:"Glassware/Stemware"},
          {value:"tinware", text:"Tinware"},
          {value:"utensils", text:"Serving Items and Utensils"},
          {value:"baskets", text:"Baskets"},
          {value:"china", text:"China/Crockery"},
          {value:"pots", text:"Pots, Pans, Kettles"},
          {value:"appliances", text:"Appliances"},
          {value:"matches", text:"Matches"},         
          {value:"other", text:"Other"},
        ]
      ],
      [
        "farm", [
          {value:"animal-powered-tillage", text:"Animal-Powered Tillage Tools"}, 
          {value:"livestock-tack", text:"Livestock Tack"},
          {value:"hand-tools", text:"Hand Tools"},
          {value:"wagons", text:"Wagons"},
          {value:"seed", text:"Seed"},
          {value:"gins", text:"Gins"},
          {value:"cotton-whippers", text:"Cotton Whippers"},
          {value:"harnesses", text:"Harnesses"},
          {value:"buckets", text:"Buckets"},
          {value:"plantation-utensils", text:"Plantation Utensils"}, 
          {value:"building-hardware", text:"Building Hardware"},
          {value:"scales", text:"Scales and Weights"},
          {value:"measuring-implements", text:"Measuring Implements"},
          {value:"bells", text:"Bells"},
          {value:"whips", text:"Whips"},
          {value:"chains", text:"Chains, Ropes, and Cordage"},
          {value:"lumber", text:"Lumber"},
          {value:"other", text:"Other"},
        ] 
      ],
      [
        "clothing", [
          {value:"flatware", text:"Shirts"}, 
          {value:"cups", text:"Trousers"},
          {value:"glassware", text:"Dresses"},
          {value:"tinware", text:"Undergarments"},
          {value:"utensils", text:"Footwear"},
          {value:"baskets", text:"Outerwear"},
          {value:"china", text:"Hats"},        
          {value:"other", text:"Other"},
        ]
      ],
      [
        "people", [
          {value:"men", text:"Men"}, 
          {value:"women", text:"Women"},
          {value:"children", text:"Children"},
          {value:"infant", text:"Infant"},
          {value:"elderly", text:"Elderly"},
          {value:"runaway", text:"Runaway"},
          {value:"field-hand", text:"Field Hand"},
          {value:"servants", text:"House Servant"},
          {value:"driver", text:"Driver"},
          {value:"tradesman", text:"Tradesman"},         
          {value:"other", text:"Unknown/Other"},
        ]
      ],
      [
        "real-estate", [
          {value:"house", text:"House"}, 
          {value:"farmland", text:"Farmland"},
          {value:"acreage", text:"Undeveloped Acreage"},
          {value:"timberland", text:"Timberland"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "financial-instrument", [
          {value:"cash", text:"Cash"}, 
          {value:"stocks", text:"Stocks"},
          {value:"bonds", text:"Bonds"},
          {value:"metals", text:"Precious Metals"},
          {value:"current-bank-bills", text:"Current Bank Bills"},
          {value:"non-current-bank-bills", text:"Non-Current Bank Bills"},
          {value:"notes-of-credit-debt", text:"Notes of Debt and Credit"},
          {value:"mortgage-rent", text:"Mortgage/Rent"},
          {value:"interest-paid-out", text:"Interest Paid Out"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "personal-items", [
          {value:"books", text:"Books"}, 
          {value:"watches", text:"Watches"},
          {value:"jewelry", text:"Jewelry"},
          {value:"mementos", text:"Mementos"},
          {value:"toiletries", text:"Toiletries and Grooming"},
          {value:"pipes", text:"Pipes"},
          {value:"cigars", text:"Cigars"},
          {value:"locks", text:"Locks"},
          {value:"writing-paraphernalia", text:"Writing Paraphernalia"},
          {value:"maps", text:"Maps"}, 
          {value:"tobacco", text:"Tobacco"},
          {value:"soaps", text:"Soaps"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "firearms", [
          {value:"rifles", text:"Rifles"}, 
          {value:"shotguns", text:"Shotguns"},
          {value:"pistols", text:"Pistols"},
          {value:"muskets", text:"Muskets"},
          {value:"archery", text:"Archery"},
          {value:"powder-shot", text:"Powder/Shot"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "transportation", [
          {value:"horse-drawn-conveyance", text:"Horse-Drawn Conveyance"}, 
          {value:"boat", text:"Boat"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "foodstuffs", [
          {value:"sugar-candy", text:"Sugar/Candy"}, 
          {value:"grease", text:"Fats/Grease"},
          {value:"preserves", text:"Fruits/Preserves"},
          {value:"vegetables", text:"Vegetables"},
          {value:"grains-legumes-nuts-seeds", text:"Grains, Legumes, Nuts, Seeds"},
          {value:"flour-meal", text:"Flour and Meal"},
          {value:"fish-seafood", text:"Fish and Seafood"},
          {value:"dairy", text:"Dairy"},
          {value:"eggs", text:"Eggs"},
          {value:"meat", text:"Meat"}, 
          {value:"bacon", text:"Bacon"},
          {value:"spices", text:"Spices"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "alcohol", [
          {value:"wine", text:"Wine"}, 
          {value:"beer-cider", text:"Beer and Cider"},
          {value:"spirits", text:"Spirits/Liqueurs"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "agricultural-commodities", [
          {value:"grains", text:"Miscellaneous Grains"}, 
          {value:"rice", text:"Rice"},
          {value:"corn", text:"Corn"},
          {value:"cotton", text:"Cotton"},
          {value:"tobacco", text:"Tobacco"},
          {value:"sugar", text:"Sugar"},
          {value:"seed", text:"Seed"},
          {value:"other", text:"Other"},
        ]
      ],
      [
        "livestock-animals", [
          {value:"horse-mule-donkey", text:"Horse/Mule/Donkey"}, 
          {value:"sheep-goats", text:"Sheep/Goats"},
          {value:"cattle", text:"Cattle"},
          {value:"hogs", text:"Hogs"},
          {value:"poultry", text:"Poultry"},
          {value:"bees", text:"Bees"},
          {value:"exotic-animals", text:"Exotic Animals"},
          {value:"other", text:"Other"},
        ]
      ],
    ]);
  
  

  osd?: dragon.Viewer;
  constructor(private route: ActivatedRoute, private location: Location, private recordService: RecordService, private renderer: Renderer2) { 
  }

  populateSubcategory(lineIndex: number): void {
    const selectObject = document.getElementById("category-" + lineIndex) as HTMLInputElement;
    let subcategories = this.subcategoryMap.get(selectObject?.value);
    console.log(subcategories);
    let subcategorySelect = document.getElementById("subcategory-" + lineIndex);
    while(subcategorySelect?.firstChild) {
      subcategorySelect.removeChild(subcategorySelect.firstChild);
    }
    if(subcategories) {
      for(let i = 0; i < subcategories.length; i++) {
        let optionJSON = subcategories[i];
        console.log(optionJSON);
        let optionElement = document.createElement("option");
        optionElement.setAttribute("value", optionJSON.value);
        let textNode = document.createTextNode(optionJSON.text);
        optionElement.appendChild(textNode);
        subcategorySelect?.appendChild(optionElement);
      } 
    }
  }

  highlightText(index: number): void {
    console.log(`line ${index} highlighted`);
    const OVERLAY_ID = 'highlighted-line';
    const boundingBox = this.record?.lines[index].boundingBox;
    console.log(boundingBox);
    // check if overlay exists
    let overlay = document.getElementById(OVERLAY_ID);
    if(overlay) {
      this.osd?.removeOverlay(OVERLAY_ID);
    }

    overlay = this.renderer.createElement('div');
    this.renderer.setProperty(overlay, 'id', OVERLAY_ID);
    this.renderer.setProperty(overlay, 'className', 'highlight');
    this.renderer.appendChild(document.body, overlay);
    const rect = new dragon.Rect(boundingBox?.Left, boundingBox?.Top, boundingBox?.Width, boundingBox?.Height);
    rect.y /= 2;
    rect.height /= 2;
    this.osd?.addOverlay({element: overlay!, location: rect});
    // this.osd?.viewport.panTo(new dragon.Point(rect.x + rect.width / 2, rect.y - rect.height / 2));
    this.osd?.viewport.fitBoundsWithConstraints(rect);
    console.log('zoom is ' + this.osd?.viewport.getZoom());
  }

  async getRecord(id: string): Promise<void> {
    console.log('getting records');
    // this.record = await this.recordService.getProbateRecord(id);
    this.recordService.getRecord(id).subscribe(record => {
      this.record = {id, ...record};
      // console.log(record);
      const infoUrl = `https://d2ai2qpooo3jtj.cloudfront.net/iiif/2/${id}/info.json`;
      this.osd = new dragon.Viewer({
        element: this.viewer.nativeElement,
        showRotationControl: true,
        // Enable touch rotation on tactile devices
        gestureSettingsTouch: {
            pinchToZoom: true,            
        },
        maxZoomLevel: 5.0,
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        tileSources: infoUrl
      });
    });

    console.log('records received');
  }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.getRecord(id);
    

  }

}
