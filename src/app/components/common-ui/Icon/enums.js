import { ColorNames } from 'components/common-ui/Colors';

export default {
    COLOR: Object.keys(ColorNames()).reduce((obj, name) => {
        obj[String(name).toUpperCase()] = name;
        return obj;
    }, {}),
};
