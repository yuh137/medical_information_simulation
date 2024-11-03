
using Medical_Information.API.Repositories.Interfaces;

namespace Medical_Information.API.Services
{
    public class ExpirationService : BackgroundService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly TimeSpan checkInterval = TimeSpan.FromSeconds(1);

        public ExpirationService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAndExpireEventsAsync();
                await Task.Delay(checkInterval, stoppingToken); // Wait for the specified interval before checking again
            }
        }

        private async Task CheckAndExpireEventsAsync()
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var eventRepository = scope.ServiceProvider.GetRequiredService<IAdminQCLotRepository>();

                try
                {
                    //var 
                } catch (Exception ex)
                {

                }
            }
        }
    }
}
