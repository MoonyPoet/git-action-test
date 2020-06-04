class CampusMsg {
    constructor({ campusData} = {}) {
        this.campusData = campusData;
    }
    getCampusData() {
        return this.campusData;
    }
    setCampusData(v) {
        this.campusData = v;
    }
}
let campus = new CampusMsg();
export {
    campus
}