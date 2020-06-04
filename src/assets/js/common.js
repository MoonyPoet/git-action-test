//业务的公共方法
// 根据校区反推城市
function getProvince(provinceCampus,campusIds){
    let obj={};
    provinceCampus.map((element)=>{
        if(obj[element.provinceNum]===undefined){
          obj[element.provinceNum]={};
          obj[element.provinceNum]['campusIds']=[];
        }
        obj[element.provinceNum]['campusIds'].push(element.value)
      })
      let campusIdArr=campusIds.split(",");
      let province=[];
      for(let key in obj){
        if(obj[key].campusIds&&obj[key].campusIds.length>0){
          obj[key].campusIds.map((item)=>{
            if(campusIdArr.some((note)=>Number(note)===item)){
              province.push(key)
            }
          })
        } 
      }
    return [...new Set(province)];
}
/**
 *
 *
 * @param {*} campusData 校区数据
 * @param {*} province 城市 
 * @param {*} campusIds 已选校区数据
 * @returns
 */
function getCampusVos(campusData,province,campusIds){
    let campusVos=[];
    let obj={};
    campusData.map((element)=>{
        if(obj[element.provinceNum]===undefined){
          obj[element.provinceNum]={};
          obj[element.provinceNum]['len']=0;
          obj[element.provinceNum]['campusIds']=[];
        }
        obj[element.provinceNum]['len']++;
        obj[element.provinceNum]['campusIds'].push(element.value)
      })
      for(let key in obj){
        if(province.some((item)=>Number(key)===item)){
          let areaNum=key;
          let campusIdArr=[];
          campusIds.map((item)=>{
            if(obj[key].campusIds.some((note)=>note===item)){
                campusIdArr.push(item)
            }
          })
          campusVos.push({
            areaNum:areaNum,
            campusIds:campusIdArr.toString()
          })
        }
    }
    return campusVos;
  }
/**
 *
 *
 * @param {*} campusData 校区城市数据
 * @param {*} campusIds 校区id 数组
 * @returns
 */
function getCampusVods(campusData,campusIds){
  let campusVods=[];
  campusData.map((item)=>{
      if(campusIds.some((campusId)=>campusId===item.value)){
        campusVods.push({
          areaNum:item.areaNum,
          campusId:item.value
        })
      }
  })
  return campusVods;
}
/**
 *
 *
 * @param {*} campusIds 校区id 数组
 * @param {*} codeData 数据字典
 * @returns
 */
function getAreaIds(campusIds,codeData){
  let areaIds=[];
  if(codeData.campus&&codeData.campus.length===0){
    return [];
  }
  codeData.campus.map((item)=>{
    if(campusIds.some((note)=>Number(note)===item.value)){
      areaIds.push(item.areaNum)
    }
  })
  //去重和转数据类型
  areaIds=[...new Set(areaIds)].map((item)=>Number(item));
  return areaIds;
}
export {
  getCampusVods,
  getAreaIds
}