const Sequelize =require('sequelize')

const sequelize =new Sequelize('sqlite:home_service');

const Service =sequelize.define('service',{
    id:{
      field:'servcie_id',
      type:sequelize.INTEGER,
      primarykey:true
    },
    name:{
      field:'servcie_name',
      type:sequelize.STRING

    },
    icon:{
      field:'servcie_icon',
      type:sequelize.SRTING

    }
  },
  {
    timestamp:false
  });
  export default Service;
  