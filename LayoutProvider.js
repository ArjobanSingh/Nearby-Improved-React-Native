import { GridLayoutProvider } from 'recyclerlistview-gridlayoutprovider';
const MAX_SPAN = 4;
export default class LayoutProvider extends GridLayoutProvider {
    constructor(props) {
        super(MAX_SPAN, 
            (index) => {
                return props.getDataForIndex(index).type;
            },
            (index) => {
                let type = props.getDataForIndex(index).type;
                switch (type){
                    case "ITEM_SPAN_2":
                        return 2;
                }
            },
            (index) => {
                return 400;
            },
            
        );
    }
}