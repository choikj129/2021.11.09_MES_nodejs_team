const ps = require("python-shell");

var options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: ['value1']
};

module.exports = {
    opt: function(callback){
        ps.PythonShell.run("xbar.py", options, 
        function(err, result){
            if (err){
                console.log(err);
            }else{
                callback(result)
            }
        })
    }
}