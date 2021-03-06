var qw1 = 0, qw2 = 0;
var acavgx1 = 0, acavgx2 = 0, acavgy1 = 0, acavgy2 = 0;
var count = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0;

var acc = {
    x: 0,
    y: 0,
    z: 0
};

var x_0 = $V([acc.x, acc.y, acc.z]);
var P_0 = $M([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);
var sc3 = 0;
var sc4 = 0;
var v1 = new Array(240);
var v2 = new Array(200);
var F_k = $M([
    [1, 0.0166, 0.0002],
    [0, 1, 0.0166],
    [0, 0, 1]
]); //identity matrix. How change to model is applied. Set to 1
var Q_k = $M([
    [0.011, 0, 0],
    [0, 0.019, 0],
    [0, 0, 0.019]
]); //empty matrix. Noise in system is zero
var KM = new KalmanModel(x_0, P_0, F_k, Q_k);
var z_k = $V([acc.x, acc.y, acc.z]); //Updated accelerometer values
var H_k = $M([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]); //identity matrix. Describes relationship between model and observation
var R_k = $M([
    [2, 0, 0],
    [0, 2, 0],
    [0, 0, 2]
]); //2x Scalar matrix. Describes noise from sensor. Set to 2 to begin
var KO = new KalmanObservation(z_k, H_k, R_k);
var ax = 0, ay = 0, az = 0, alpha = 0, beta = 0, gamma = 0, timeInt = 0, timeTot = 0;
var vx = 0, vy = 0, vz = 0;
var sx = 0, sy = 0, sz = 0;
var Ax = 0, Ay = 0, Az = 0;
var x = 0, y = 0, z = 0;
var vpx = 0, vpy = 0, vpz = 0;
var sc1 = 0;
var sc2 = 0;
var j = 0;

var arr = [];

var checker = function(event) {
    count++;
    
    Ax = event.acceleration.x;
    Ay = event.acceleration.y;
    Az = event.acceleration.z;
    alpha = event.rotationRate.alpha;
    beta = event.rotationRate.beta;
    gamma = event.rotationRate.gamma;
    var t = event.interval;
    x = x + t * alpha;
    y = y + t * beta;
    z = z + t * gamma;
    x = x * 180 / 3.14;
    x = x % 360;
    x = x * 3.14 / 180;
    y = y * 180 / 3.14;
    y = y % 360;
    if (y > 180)
        y = y - 360;
    y = y * 3.14 / 180;
    z = z * 180 / 3.14;
    z = z % 180;
    if (z > 90)
        z = z - 180;
    z = z * 3.14 / 180;
    var c3 = Math.cos(z);
    var c2 = Math.cos(y);
    var c1 = Math.cos(x);
    var s1 = Math.sin(x);
    var s2 = Math.sin(y);
    var s3 = Math.sin(z);
    ax = Ax * c3 * c1 + Ay * (s2 * s3 * c1 - s1 * c2) + Az * (c2 * s3 * c1 + s1 * s2);
    ay = Ax * (s2 * s3 * c1 - c3 * s1) + Ay * (c2 * c1 + s1 * s2 * s3) + Az * (c2 * s3 * s1 - s2 * c1);
    
    if (ax > 0)
    {
        acavgx1 = acavgx1 + ax;
        c1++;
    }
    if (ax < 0)
    {
        acavgx2 = acavgx2 + ax;
        c2++;
    }
    if (ay > 0)
    {
        acavgy1 = acavgy1 + ay;
        c3++;
    }
    if (ay < 0)
    {
        acavgy1 = acavgy1 + ay;
        c4++;
    }
    if (count > 200)
    {
        acavgy1 = acavgy1 / c3;
        acavgx1 = acavgx1 / c1;
        acavgx2 = acavgx2 / c2;
        acavgy2 = acavgy2 / c4;
        alert(acavgy1);
        alert(acavgy2);
        alert(acavgx1);
        alert(acavgx2);
        
        discall(event);
    }
};

var discall = function(event) {
    Ax = event.acceleration.x;
    Ay = event.acceleration.y;
    Az = event.acceleration.z;
    alpha = event.rotationRate.alpha;
    beta = event.rotationRate.beta;
    gamma = event.rotationRate.gamma;
    /*
     the variable v is going to take values for the function checkIfStop which checks whether the phone movement has stopped or not 
     it will take in angular velocity and check whether its close to 0 and angular acceleration 
     this function is gyro independent and we will consider a counter upto 240 (some number that i took ie approximately 40 readings ie if it is not in motion and it will keep on automatically updating itself)
     i am taking a counter and considering only the most recent 40 readings,if the motion has stopped then it will take the average of those readings to take the coordinates and the equation of the plane
     */
    v1[sc1] = Ax;
    sc1++;
    v1[sc1] = Ay;
    sc1++;
    v1[sc1] = Az;
    sc1++;
    v1[sc1] = alpha;
    sc1++;
    v1[sc1] = beta;
    sc1++;
    v1[sc1] = gamma;
    sc1++;
    sc2 = 1;
    if (sc1 > 238)
    {
        sc1 = 0;
        sc2 = 1;
    }
    if (sc2)
        sc3 = checkIfStop();
    var t = event.interval;
    x = x + t * alpha;
    y = y + t * beta;
    z = z + t * gamma;
    alert("Distance calculation has begun");
    x = x * 180 / 3.14;
    x = x % 360;
    x = x * 3.14 / 180;
    y = y * 180 / 3.14;
    y = y % 360;
    if (y > 180)
        y = y - 360;
    y = y * 3.14 / 180;
    z = z * 180 / 3.14;
    z = z % 180;
    if (z > 90)
        z = z - 180;
    z = z * 3.14 / 180;
    var c3 = Math.cos(z);
    var c2 = Math.cos(y);
    var c1 = Math.cos(x);
    var s1 = Math.sin(x);
    var s2 = Math.sin(y);
    var s3 = Math.sin(z);
    ax = Ax * c3 * c1 + Ay * (s2 * s3 * c1 - s1 * c2) + Az * (c2 * s3 * c1 + s1 * s2);
    ay = Ax * (s2 * s3 * c1 - c3 * s1) + Ay * (c2 * c1 + s1 * s2 * s3) + Az * (c2 * s3 * s1 - s2 * c1);
    // az = -Ax*s3 + Ay*s2*c3 + Az*c2*c3;
    ax = lpfilter(ax, acavgx1, acavgx2);
    ay = lpfilter(ay, acavgy1, acavgy2);
    KO.z_k = $V([ax, ay, az]);
    KM.update(KO);
    ax = KM.x_k.elements[0];
    ay = KM.x_k.elements[1];
    vx = vpx + ax * t;
    vy = vpy + ay * t;
    vx = filter(vx, ax);
    vy = filter(vy, ay);
    sx = sx + vpx * t + .5 * t * t * ax;
    sy = sy + vpy * t + .5 * t * t * ay;
    vpx = vx;
    vpy = vy;
    v2[j] = sx;
    j++;
    v2[j] = sy;
    j++;
    v2[j] = x;
    j++;
    v2[j] = y;
    j++;
    v2[j] = z;
    j++;
    if (j > 158)
        j = 0;
    if (sc3)
    {
        var a = disavg();
        storeCoord(a);
        // var a represents the coordinates required for the equation of the plane
        // 0,1 are x and y coord , 2,3,4 are alpha beta and gamma           
        // take readings/ store readings and then vibrate or sound whatever
    }
};

function disavg() {
    var aq = [0, 0, 0, 0, 0];
    for (var i = 0; i < 200; i = i + 5)
    {
        aq[0] = aq[0] + v2[i];
        aq[1] = aq[1] + v2[i + 1];
        aq[2] = aq[2] + v2[i + 2];
        aq[3] = aq[3] + v2[i + 3];
        aq[4] = aq[4] + v2[i + 4];
    }
    for (i = 0; i < 5; i++)
    {
        aq[i] = aq[i] / 40;
    }
    return aq;
}

function disstop()
{
    // output dist
}

function lpfilter(z, a, b) {
    //low pars filter takes 3 inputs z(number to be checked ) a and b(filter between a and b)   
    if (z > a)
        z = z - a;
    if (z < a && z > b)
        z = 0;
    else if (z < b)
        z = z - b;
    if (z > 1.5)
        z = 1.5;
    else if (z < -1.5)
        z = -1.5;
    return z;
}

function filter(v, a) {
    if (a < .05 && a > -.05)
        v = v * .9;
    return v;
}

function planesolv(a, b) {
    /* 
     input:
     assuming 0,1,2 represent co-ordinates and 3,4,5 represent tangents of the angles 
     output:
     resultant is in the form of a straight 3d line x-x1/a = y-y1/b = z-z1/c
     so, x1,y1,z1 are 0,1,2 and a,b,c are 3,4,5
     */
    var res = new Array(6);
    res[0] = (((a[0] * a[4]) / a[5]) + ((a[2] * a[3]) / a[5]) - ((b[0] * b[4]) / b[5]) - ((b[2] * b[3]) / b[5]) + a[1] - b[1]) / (a[4] - b[4]);
    res[1] = (((a[1] * a[5]) / a[4]) + ((a[2] * a[3]) / a[4]) - ((b[1] * b[5]) / b[4]) - ((b[2] * b[3]) / b[4]) + a[0] - b[0]) / (a[5] - b[5]);
    res[2] = 0;
    res[3] = a[5] * b[3] - a[3] * b[5];
    res[4] = a[3] * b[4] - a[4] * b[3];
    res[5] = a[4] * b[5] - a[5] * b[4];
    return res;
}

function planeCreate(a) {
    /* this function will take the coordinates and calculate the tangents ,as well as store them */
    // assuming 0,1,2 are sx,sy,sz and 3,4,5 are tangents of angles taken from gyroscope
    var b = new Array(4);
    var v = a[0] * a[4] + a[1] * a[5] + a[2] * a[3];
    b[0] = a[4] / v;
    b[1] = a[5] / v;
    b[2] = a[3] / v;
    b[3] = 1;
    //0 is coeff of x,1 is coeff of y,2 is coeff of z and 3 is the constant
    return b;
}

function checkPlane(a, b) {
    /* a and b represent 2 consecutive readings taken from the phone*/
    // where 0,1,2,3 represent coefficients of the plane in the form of ax+by+cz=d
    var c = 1;
    if (!(inBetween(b[0], (a[0] * 1.2), (a[0] * .8))))
        c = 0;
    if (!(inBetween(b[1], (a[1] * 1.2), (a[1] * .8))))
        c = 0;
    if (!(inBetween(b[2], (a[2] * 1.2), (a[2] * .8))))
        c = 0;
    return c;
    // if c is 1 then it is the same wall else not  
}

function inBetween(a, b, c) {
    if (a > b && a < c)
        return 1;
    return 0;
}

function samePlane(a, b) {
    // assuming 2 planes are the same in actual or they satisfy check plane function
    // then this function would create a plane using their combination and return a third plane 
    var c = new Array(4);
    c[3] = 1;
    c[1] = (a[1] + b[1]) / 2;
    c[0] = (a[0] + b[0]) / 2;
    c[2] = (a[2] + b[2]) / 2;
}

function handleOrientation(event) {
    /* returns alpha beta and gamma values as 0,1,2 positions */
    var alpha = event.alpha;
    var beta = event.beta;
    var gamma = event.gamma;
    var arr = new Array(3);
    arr[0] = alpha;
    arr[1] = beta;
    arr[2] = gamma;
    return arr;
}

function storeCoord(a) {
    // this function is made assuming the first and last stored coordinate are of the same wall
    // this funciton will also give the dimensions of the room
    //declare new 2d array named arr
    arr[qw1++] = a;
}

function formWall(a) {
}

var register = function() {
    window.addEventListener( 'ondevicemotion', checker );
};

var deregister = function() {
    window.removeEventListener( 'ondevicemotion', checker );
};

register();
