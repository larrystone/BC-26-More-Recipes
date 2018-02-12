import { configure } from 'enzyme';
import toastr from 'toastr';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.toastr = toastr;
