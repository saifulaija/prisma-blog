import httpStatus from "http-status";
import prisma from "../../../shared/prismaClient";
import { Published_status, UserRole } from "@prisma/client";
import { HTTPError } from "../../errors/HTTPError";
import { VerifiedUser } from "../../interfaces/common";

const fetchDashboardMetadata = async (user: any) => {
  let metadata;
  switch (user.role) {
    case UserRole.ADMIN:
      metadata = await getAdminDashboardMetadata();
      break;
    case UserRole.SUPER_ADMIN:
      metadata = await getSuperAdminDashboardMetadata();
      break;
    case UserRole.MODERATOR:
      metadata = await getDoctorDashboardMetadata(user);
      break;
    case UserRole.BLOGGER:
      metadata = await getBloggerDashboardMetadata(user);
      break;
    default:
      throw new Error("Invalid user role");
  }

  return metadata;
};

const getAdminDashboardMetadata = async () => {
  const blogCount = await prisma.blog.count();
  const bloggerCount = await prisma.author.count();
  const adminCount = await prisma.admin.count();
  const commentCount = await prisma.comment.count();
  const likeCount = await prisma.like.count();
  const moderatorCount = await prisma.moderator.count();

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return { blogCount, bloggerCount, adminCount, commentCount, likeCount };
};

const getSuperAdminDashboardMetadata = async () => {
  // const appointmentCount = await prisma.appointment.count();
  // const patientCount = await prisma.patient.count();
  // const doctorCount = await prisma.doctor.count();
  // const adminCount = await prisma.admin.count();
  // const paymentCount = await prisma.payment.count();
  // const totalRevenue = await prisma.payment.aggregate({
  //     _sum: { amount: true }
  // });
  // const barChartData = await getBarChartData();
  // const pieChartData = await getPieChartData();
  // return { appointmentCount, patientCount, doctorCount, adminCount, paymentCount, totalRevenue, barChartData, pieChartData };
};

const getBloggerDashboardMetadata = async (user: VerifiedUser) => {
  const blogger = await prisma.author.findUnique({
    where: {
      email: user?.email,
    },
  });



  if (!blogger) {
    throw new HTTPError(httpStatus.BAD_REQUEST, "Patient not found!");
  }

  const blogCount = await prisma.blog.count({
    where: {
      authorId: blogger.id,
    },
  });

  const pendingBlogCount= await prisma.blog.count({
    where:{
    publishedStatus:Published_status.PENDING
    }
  })
  const approvedBlogCount= await prisma.blog.count({
    where:{
    publishedStatus:Published_status.APPROVED
    }
  })
  const cancelBlogCount= await prisma.blog.count({
    where:{
    publishedStatus:Published_status.CANCEL
    }
  })
  const commentCount= await prisma.comment.count({
  where:{
    authorId:blogger.id
  }})

  const viewCount = await prisma.blog.aggregate({
    where: {
      authorId: blogger.id,
    },
    _sum: {
      views: true,
    },
  });

  const totalViews = viewCount._sum?.views || 0;
  return {
    blogCount,cancelBlogCount,approvedBlogCount,pendingBlogCount,commentCount,totalViews
  };
};




const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint }[] =
    await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
               COUNT(*) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;

  const formattedMetadata = appointmentCountByMonth.map(({ month, count }) => ({
    month,
    count: Number(count), // Convert BigInt to integer
  }));
  return formattedMetadata;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const formattedData = appointmentStatusDistribution.map(
    ({ status, _count }) => ({
      status,
      count: Number(_count.id), // Convert BigInt to integer
    })
  );

  return formattedData;
};

export const metaServices = {
  fetchDashboardMetadata,
};
