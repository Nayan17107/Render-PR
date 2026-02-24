const flashMessage = (req, res, next) => {
    const success = req.flash('success');
    const error = req.flash('error');
    const warning = req.flash('warning');
    const info = req.flash('info');

    res.locals.success_msg = success;
    res.locals.error_msg = error;
    res.locals.warning_msg = warning;
    res.locals.info_msg = info;

    res.locals.flash = {
        success: success,
        error: error,
        warning: warning,
        info: info
    }
    next()
}

module.exports = flashMessage;