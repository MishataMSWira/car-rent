import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import md5 from "md5";
import { sign } from "jsonwebtoken"


/** create an object of Prisma */
const prisma = new PrismaClient({log:["error"]});

/** create a function to "create" new event */
/** asynchronous = fungsi yg berjalan secara paralel */
const createAdmin = async (request: Request, response: Response) => {
  try {
    /** read a request from body */
    const adminName = request.body.adminName
    const email = request.body.email
    const password = md5(request.body.password)

    /** insert to events table using prisma */
    const newData = await prisma.admin.create({
      data: {
        adminName,
        email,
        password
      },
    });

    return response.status(200).json({
      status: true,
      message: `Admin has been created`,
      data: newData,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/** create a function to READ users */
const readAdmin = async (request: Request, response: Response) => {
  try {
    const page = Number(request.query.page) || 1;
    const qty = Number(request.query.qty) || 10;
    const keyword = request.query.keyword?.toString() || "";
    const dataAdmins = await prisma.admin.findMany({
      take: qty, // mendefinisikan jml data yg diambil
      skip: (page -1) * qty,
      where: {
        OR: [
          {adminName: {contains: keyword}},
          {email: {contains: keyword}},
        ]
      },
      orderBy: {adminName: "asc"}
    });
    return response .status(200).json({
        status: true,
        message: `Admins has been loaded`,
        data: dataAdmins
    })
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/** function for update seats */
const updateAdmin = async (request: Request, response: Response) => {
  try {
    /** read seatID yg that sent from URL */
    const adminID = request.params.userID;
    /** read data perubahan */
    const adminName = request.body.adminName
    const email = request.body.email
    const password = md5(request.body.password)

    /** make sure that data has exists */
    const findAdmin = await prisma.admin.findFirst({
      where: { adminID: Number(adminID) },
    });

    if (!findAdmin) {
      /** give a respon when seats not found */
      return response.status(400).json({
        status: false,
        message: `Data admins not found...`,
      });
    }

    const dataAdmins = await prisma.admin.update({
      where: { adminID: Number(adminID) },
      data: {
        adminName: adminName || findAdmin.adminName,
        email: email || findAdmin.email,
        password: password || findAdmin.password
      },
    });

    return response.status(200).json({
      status: true,
      message: `Admins has been updated`,
      data: dataAdmins,
    });
  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

/**create a function to delete event */
const deleteAdmin = async (request: Request, response: Response) => {
  try {
    /**get event ID from URL */
    const adminID = request.params.adminID

    /**make sure that event is exist */
    const findAdmins = await prisma.admin.findFirst({
      where: { adminID: Number(adminID)}
    })
    if (!findAdmins) {
      /** give a respon when event not found */
      return response.status(400).json({
        status: false,
        message: `Data admin not found...`,
      });
    }

    /**execute for delete event */
    const dataAdmins = await prisma.admin.delete({
      where : {adminID: Number(adminID)}
    })
    return response.status(200)
    .json({
      status: true,
      message: `Data Admin has been deleted`,
    })

  } catch (error) {
    return response.status(500).json({
      status: false,
      message: error,
    });
  }
};

const loginAdmin = async (request: Request, response: Response) => {
  try {
    const email = request.body.email
    const password = md5(request.body.password)
    const admin = await prisma.admin.findFirst(
      {
        where: {
          email: email, 
          password: password
        }
      }
    )
    if (admin) {
      const payload = admin
      const secretkey = 'himitsu🤫🤫'
      const token = sign(payload,secretkey)

      return response.status(200).json({
        status: true, 
        message: "Login Successful 😍",
        token: token
      })
    }
    else {
      return response.status(200).json({
        status: false,
        message: "Login Failed, Please Try Again"
      })
    }

  } catch (error) {
    return response.status(500).json({
      status: false, message: error
    })
  }
}

export {createAdmin, readAdmin, updateAdmin, deleteAdmin, loginAdmin}