Input = {}
Input.KeysDown = {}

Input.BACKSPACE = 8;
Input.TAB = 9;
Input.ENTER = 13;
Input.SHIFT = 16;
Input.CTRL = 17;
Input.ALT = 18;
Input.PAUSE_BREAK = 19;
Input.CAPS_LOCK = 20;
Input.ESCAPE = 27;
Input.PAGE_UP = 33;
Input.PAGE_DOWN = 34;
Input.END = 35;
Input.HOME = 36;
Input.LEFT_ARROW = 37;
Input.UP_ARROW = 38;
Input.RIGHT_ARROW = 39;
Input.DOWN_ARROW = 40;
Input.INSERT = 45;
Input.DELETE = 46;
Input.ZERO = 48;
Input.ONE = 49;
Input.TWO = 50;
Input.THREE = 51;
Input.FOUR = 52;
Input.FIVE = 53;
Input.SIX = 54;
Input.SEVEN = 55;
Input.EIGHT = 56;
Input.NINE = 57;
Input.A = 65;
Input.B = 66;
Input.C = 67;
Input.D = 68;
Input.E = 69;
Input.F = 70;
Input.G = 71;
Input.H = 72;
Input.I = 73;
Input.J = 74;
Input.K = 75;
Input.L = 76;
Input.M = 77;
Input.N = 78;
Input.O = 79;
Input.P = 80;
Input.Q = 81;
Input.R = 82;
Input.S = 83;
Input.T = 84;
Input.U = 85;
Input.V = 86;
Input.W = 87;
Input.X = 88;
Input.Y = 89;
Input.Z = 90;
Input.LEFT_WINDOW_KEY = 91;
Input.RIGHT_WINDOW_KEY = 92;
Input.SELECT_KEY = 93;
Input.NUMPAD_ZERO = 96;
Input.NUMPAD_ONE = 97;
Input.NUMPAD_TWO = 98;
Input.NUMPAD_THREE = 99;
Input.NUMPAD_FOUR = 100;
Input.NUMPAD_FIVE = 101;
Input.NUMPAD_SIX = 102;
Input.NUMPAD_SEVEN = 103;
Input.NUMPAD_EIGHT = 104;
Input.NUMPAD_NINE = 105;
Input.MULTIPLY = 106;
Input.ADD = 107;
Input.SUBTRACT = 109;
Input.DECIMAL_POINT = 110;
Input.DIVIDE = 111;
Input.F1 = 112;
Input.F2 = 113;
Input.F3 = 114;
Input.F4 = 115;
Input.F5 = 116;
Input.F6 = 117;
Input.F7 = 118;
Input.F8 = 119;
Input.F9 = 120;
Input.F10 = 121;
Input.F11 = 122;
Input.F12 = 123;
Input.NUM_LOCK = 144;
Input.SCROLL_LOCK = 145;
Input.SEMI_COLON = 186;
Input.EQUAL_SIGN = 187;
Input.COMMA = 188;
Input.DASH = 189;
Input.PERIOD = 190;
Input.FORWARD_SLASH = 191;
Input.GRAVE_ACCENT = 192;
Input.OPEN_BRACKET = 219;
Input.BACK_SLASH = 220;
Input.CLOSE_BRAKET = 221;
Input.SINGLE_QUOTE = 222;

Input.IS_MOUSE_DOWN = false;
Input.MousePosition = new Vector();

Input.onStageKeyDown = function(evt) {
    Input.KeysDown[evt.keyCode] = true;
}

Input.onStageKeyUp = function(evt) {
    Input.KeysDown[evt.keyCode] = false;
}

document.addEventListener("keydown", Input.onStageKeyDown, false);
document.addEventListener("keyup", Input.onStageKeyUp, false);

Input.setupMouse = function(canvas) {
    canvas.addEventListener("mousemove", Input.onMouseMove, false);
    canvas.addEventListener("mousedown", Input.onMouseDown, false);
    canvas.addEventListener("mouseup", Input.onMouseUp, false);
}

Input.onMouseMove = function(evt) {
    var rect = evt.target.getBoundingClientRect();
    Input.MousePosition.x = evt.clientX - rect.left;
    Input.MousePosition.y = evt.clientY - rect.top;
}

Input.onMouseDown = function(evt) {
    Input.IS_MOUSE_DOWN = true;
}

Input.onMouseUp = function(evt) {
    Input.IS_MOUSE_DOWN = false;
}

Input.cursor = {
    normal: function() {
        $('html,body').css('cursor','auto');
    },

    hand: function() {
        $('html,body').css('cursor','pointer');
    }
}