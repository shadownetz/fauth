const routes = [
    {
        path: '/dashboard',
        component: Dashboard
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

// var last_position = {},
//     $output       = $('#output');
// $(document).on('mousemove', function (event) {
//     if (typeof(last_position.x) != 'undefined') {
//         var deltaX = last_position.x - event.offsetX,
//             deltaY = last_position.y - event.offsetY;
//         if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
//             //left
//             $output.append('<li>Left</li>');
//         } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
//             //right
//             $output.append('<li>Right</li>');
//         } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
//             //up
//             $output.append('<li>Up</li>');
//         } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
//             //down
//             $output.append('<li>Down</li>');
//         }
//         if ($output.children().length > 4) {
//             $output.children().eq(0).remove();
//         }
//     }
//     last_position = {
//         x : event.offsetX,
//         y : event.offsetY
//     };
// });
