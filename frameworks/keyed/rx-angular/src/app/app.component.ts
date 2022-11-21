import {Component, VERSION, AfterViewChecked} from '@angular/core';
import {BehaviorSubject, distinct, firstValueFrom, map, Observable} from "rxjs";

interface Data {
    id: number;
    label: BehaviorSubject<string>;
    selected: Observable<boolean>
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
let idCounter = 1;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: []
})
export class AppComponent {
    data = new BehaviorSubject<Array<Data>>([]);
    selectedSubject = new BehaviorSubject<undefined | number>(undefined);
    selected = this.selectedSubject.pipe(distinct())
    version: string;

    constructor() {
        this.version = VERSION.full;
    }

    _random(max: number) {
        return Math.round(Math.random() * 1000) % max;
    }

    buildData(count: number = 1000): Array<Data> {
        const data: Array<Data> = new Array<Data>(count);
        for (var i = 0; i < count; i++) {
            data[i] = {
                id: idCounter,
                label: new BehaviorSubject(adjectives[this._random(adjectives.length)] + " " + colours[this._random(colours.length)] + " " + nouns[this._random(nouns.length)]),
                selected: this.selectedSubject.pipe(map(selectedId => selectedId === idCounter))
            }
            idCounter++;
        }
        return data;
    }

    itemById(index: number, item: Data) {
        return item.id;
    }

    select(item: Data, event: Event) {
        event.preventDefault();
        this.selectedSubject.next(item.id)
    }

    async delete(id: number, event: Event) {
        event.preventDefault();
        const previous = await firstValueFrom(this.data);
        const idx = previous.findIndex(d => d.id === id);
        this.data.next([...previous.slice(0, idx), ...previous.slice(idx + 1)])
    }

    run() {
        this.data.next(this.buildData());
    }

    async add() {
        const previous = await firstValueFrom(this.data);
        this.data.next([...previous, ...this.buildData(1000)]);
    }

    async update() {
        const previous = await firstValueFrom(this.data);
        for (let i = 0; i < previous.length; i += 10) {
            firstValueFrom(previous[i].label).then(label => previous[i].label.next(label + ' !!!'))
        }
    }

    runLots() {
        this.data.next(this.buildData(10000));
        this.selectedSubject.next(undefined);
    }

    clear() {
        this.data.next([]);
        this.selectedSubject.next(undefined);
    }

    async swapRows() {
        const previous = await firstValueFrom(this.data);
        if (previous.length > 998) {
            let a = previous[1];
            previous[1] = previous[998];
            previous[998] = a;
            this.data.next(previous)
        }
    }
}