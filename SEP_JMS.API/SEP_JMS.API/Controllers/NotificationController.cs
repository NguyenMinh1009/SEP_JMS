using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SEP_JMS.Common;
using SEP_JMS.Common.Logger;
using SEP_JMS.Model;
using SEP_JMS.Model.Api.Request;
using SEP_JMS.Model.Api.Response;
using SEP_JMS.Model.Enums.System;
using SEP_JMS.Service.IServices;

namespace SEP_JMS.API.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly string logPrefix = "[NotificationController]";

        private readonly INotificationService notificationService;
        private readonly IJMSLogger logger;

        public NotificationController(INotificationService notificationService, IJMSLogger logger)
        {
            this.notificationService = notificationService;
            this.logger = logger;
        }

        [HttpPost("configure")]
        public async Task<IActionResult> ConfigureNotification(List<NotiType> types)
        {
            try
            {
                logger.Info($"{logPrefix} Start to configure notification for user {ApiContext.Current.UserId}.");
                await notificationService.ConfigureNotification(types);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when configuring notification for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Tuple<int, PagingModel<NotificationResponse>>>> GetNotifications(NotificationFilterRequest requestModel)
        {
            try
            {
                logger.Info($"{logPrefix} Start to get notifications.");
                return await notificationService.GetNotifications(requestModel);
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when getting notifications. Error: {ex}");
                return StatusCode(500);
            }
        }

        [HttpDelete("{notificationId}")]
        public async Task<IActionResult> DeleteNotification(Guid notificationId)
        {
            try
            {
                logger.Info($"{logPrefix} Start to delete notification {notificationId} for user {ApiContext.Current.UserId}.");
                await notificationService.DeleteNotification(notificationId);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when deleting notification {notificationId} for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("read/{id}")]
        public async Task<IActionResult> ReadNotification(Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update notification read time {id} for user {ApiContext.Current.UserId}.");
                await notificationService.ReadNotification(id);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating notification read time {id} for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("archive/{id}")]
        public async Task<IActionResult> ArchiveNotification(Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update notification archive time {id} for user {ApiContext.Current.UserId}.");
                await notificationService.ArchiveNotification(id);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating notification archive time {id} for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("unarchive/{id}")]
        public async Task<IActionResult> UnArchiveNotification(Guid id)
        {
            try
            {
                logger.Info($"{logPrefix} Start to update notification archive time {id} for user {ApiContext.Current.UserId}.");
                await notificationService.UnArchiveNotification(id);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating notification archive time {id} for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        [HttpPost("readall")]
        public async Task<IActionResult> ReadAll()
        {
            try
            {
                logger.Info($"{logPrefix} Start to update all notification read time for user {ApiContext.Current.UserId}.");
                await notificationService.ReadAllNotification();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when updating all notification read time for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
        
        [HttpPost("deleteAll")]
        public async Task<IActionResult> DeleteAll()
        {
            try
            {
                logger.Info($"{logPrefix} Start to delete all notification read time for user {ApiContext.Current.UserId}.");
                await notificationService.DeleteByReceiver(ApiContext.Current.UserId);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error($"{logPrefix} Got exception when deleting all notification read time for user {ApiContext.Current.UserId}. Error: {ex}");
                return StatusCode(500);
            }
        }
    }
}
