import 'react';
import 'react-dom';
import 'purecss';
import './main.css';
import './fonts.css';
import { shake } from './shake';
import component from './component';

document.body.appendChild(component());
shake();
