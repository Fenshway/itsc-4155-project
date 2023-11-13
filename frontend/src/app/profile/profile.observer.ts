import { Observable, Observer, Subscription } from "rxjs";

export default class {

    private library: number[];
    private libraryObservable: Observable<any>;
    private libraryObserver: Observer<any>|undefined;

    private games: [{game_id: number, game_name: string, img_path: string}];

    constructor(
        games: [{game_id: number, game_name: string, img_path: string}],
        library : number[] = []) {

        this.library = library;
        this.libraryObservable = new Observable((observer:Observer<any>) => {
            this.libraryObserver = observer;
        });

        this.games = games;

    }

    public updateLibrary(...updates : {GameId: number, Action: number}[]): void {
        
        //Update libary
        for(let update of updates) {
            update.GameId = update.GameId;
            if(update.Action === 1){
                this.library.push(update.GameId);
            }else if(update.Action === 0){
                const index: number = this.library.findIndex((GameId: number) => GameId === update.GameId);
                if(index === -1){continue;}
                this.library.splice(index, 1);
            }
        }
        
        //Fire observer
        for(let update of updates) {
            this.libraryObserver?.next(update);
        }

    }

    public observeLibrary(callback: (update: any) => void): Subscription {
        return this.libraryObservable.subscribe(callback);
    }

    public isInLibrary(GameId: number): boolean {
        return this.library.find((GameIdSearch: number) => GameIdSearch === GameId) !== undefined;
    }

    public getLibrary() {
        return this.library;
    }

    public getGames() {
        return this.games;
    }

    public getLibraryGames(): any[] {
        const queryData = [];
        for(let gameData of this.games) {
            if(this.library.find((gameId) => gameData.game_id === gameId)) {
                queryData.push(gameData);
            }
        }
        return queryData;
    }

}