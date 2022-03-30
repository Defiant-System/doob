
import * as THREE from "./modules/threejs/build/three.module.js";

import { Loader } from './modules/threejs/editor/js/Loader.js';
import { UIPanel, UIDiv, UIText } from './modules/threejs/editor/js/libs/ui.js';

import { TransformControls } from './classes/TransformControls.js';
import { Config } from './classes/Config.js';
import { History } from './classes/History.js';
import { SetPositionCommand } from './classes/commands/SetPositionCommand.js';
import { SetRotationCommand } from './classes/commands/SetRotationCommand.js';
import { SetScaleCommand } from './classes/commands/SetScaleCommand.js';


module.exports = {
	THREE,
	History,
	Loader,

	TransformControls,
	SetPositionCommand,
	SetRotationCommand,
	SetScaleCommand,
	Config,
	UIPanel,
	UIDiv,
	UIText,
};
