function(data) {
    var ret = {};
    ret.title = data.record.metadata.mods.titleInfo.title;

    return ret;
}